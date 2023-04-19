import { getAccessToken } from "./getAccessToken";
import { generateRandomString } from "../crypto";
import { SpotifyAuthRepository } from "../../infrastructure/spotify/SpotifyAuthRepository";

jest.mock("../crypto", () => ({
  ...jest.requireActual("../crypto"),
  generateRandomString: jest.fn(),
}));

const REDIRECT_URI = "http://127.0.0.1:7878";

describe("getAccessToken", () => {
  let originalWindowLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: new URL(REDIRECT_URI),
    });
    Object.defineProperty(window.location, "assign", {
      configurable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    window.location.href = REDIRECT_URI;
    window.localStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
  });

  it("redirects to app URI", () => {
    window.location.href = "http://localhost";

    expect(getAccessToken).toThrow("redirecting to valid app uri");

    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith(
      "http://127.0.0.1:7878"
    );
  });

  it("redirects to spotify login page if no stored access token is found", async () => {
    const codeVerifier = "0".repeat(128);
    const state = "s".repeat(16);
    const codeChallenge = "RXJXkcR7MmGMxXuIND4rzuw7CgG4O8l9FEosvBGiDD0";
    const clientId = "fd160f950e30436ebf69e14b9550cd0b";
    const scope = "user-read-private+user-read-email+streaming";
    const redirectUri = encodeURIComponent(REDIRECT_URI);
    jest.mocked(generateRandomString).mockReturnValueOnce(codeVerifier);
    jest.mocked(generateRandomString).mockReturnValueOnce(state);

    await expect(getAccessToken()).resolves.toBeNull();

    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith(
      `https://accounts.spotify.com/authorize` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&scope=${scope}` +
        `&redirect_uri=${redirectUri}` +
        `&state=${state}` +
        `&code_challenge_method=S256` +
        `&code_challenge=${codeChallenge}`
    );
  });

  describe("request access token after login redirection", () => {
    const sampleSuccessResponse = {
      access_token: "the-access-token",
      refresh_token: "the-refresh-token",
    };

    beforeEach(() => {
      const code =
        "AQBlUk5pgleHTltvPKER_di7Gl2l3oA28gOvCh0Tw5d37BrJMXmdO25lsfBSAVeMWpMYlt0dZmnx_Sz75KFamzEy8Mc-INy10ZWYCSFd6J1FAbDafVLzmWi8DLETPSDFLu-IkAmLD49wo7Nl8rlm9PlBaHovrMcyZMMMT4MA_tVPYIq0c6TJ5C04GJ1dQ9sx6O68ytMNN7rToKq1NCUTpahfBUHVaxOVeVOynTxhaES4Jrs_fbTNs_biqsJip8eA9sTdXo4-xuKhImUQzuuRTfjVuwWMMuFPSA3l";
      const state = "CfjkHzVIkCyrUzgD";
      window.location.search = `?code=${code}&state=${state}`;
    });

    it("uses code to obtain an access token", async () => {
      jest
        .spyOn(SpotifyAuthRepository.prototype, "requestAccessToken")
        .mockImplementation(() => Promise.resolve(sampleSuccessResponse));

      await expect(getAccessToken()).resolves.toEqual(
        sampleSuccessResponse.access_token
      );
    });

    it("removes the code from the URL", async () => {
      jest
        .spyOn(SpotifyAuthRepository.prototype, "requestAccessToken")
        .mockImplementation(() => Promise.resolve(sampleSuccessResponse));
      jest.spyOn(window.history, "replaceState");

      await expect(getAccessToken()).resolves.toEqual(
        sampleSuccessResponse.access_token
      );

      expect(window.history.replaceState).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        "/"
      );
    });
  });
});
