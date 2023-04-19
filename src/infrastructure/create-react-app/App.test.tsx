import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { SpotifyAuthRepository } from "../spotify/SpotifyAuthRepository";

test("renders the app", () => {
  jest
    .spyOn(SpotifyAuthRepository.prototype, "requestAccessToken")
    .mockImplementation(() =>
      Promise.resolve({
        access_token: "the-access-token",
        refresh_token: "the-refresh-token",
      })
    );

  render(<App />);
});
