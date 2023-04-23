import { SpotifyAuthRepository } from "../../infrastructure/spotify/SpotifyAuthRepository";

const clientId = "fd160f950e30436ebf69e14b9550cd0b";
const redirectUri = "http://127.0.0.1:7878";
const spotifyAuth = new SpotifyAuthRepository(clientId, redirectUri);

function forceValidAppUrl() {
  if (window.location.origin !== redirectUri) {
    window.location.assign(redirectUri);
    throw new Error("redirecting to valid app uri");
  }
}

function getCodeVerifier(): string {
  let codeVerifier = localStorage.getItem("code-verifier");
  if (!codeVerifier) {
    codeVerifier = SpotifyAuthRepository.createCodeVerifier();
    localStorage.setItem("code-verifier", codeVerifier);
  }

  return codeVerifier;
}

function invalidateCredentials(codeVerifier: string): void {
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
}

function refreshAccessToken(codeVerifier: string): Promise<string> {
  const refreshToken = localStorage.getItem("refresh-token") as string;
  return spotifyAuth.refreshAccessToken(refreshToken).then((response) => {
    localStorage.setItem("access-token", response.access_token);
    localStorage.setItem("refresh-token", response.refresh_token);
    return response.access_token;
  });
}

function validateAccessToken(accessToken: string) {
  return spotifyAuth.getProfile(accessToken);
}

function processLoginCallback(
  codeVerifier: string,
  code: string
): Promise<string> {
  return spotifyAuth.requestAccessToken(codeVerifier, code).then((response) => {
    localStorage.setItem("access-token", response.access_token);
    localStorage.setItem("refresh-token", response.refresh_token);
    return response.access_token;
  });
}

export function getAccessToken(): Promise<string | null> {
  forceValidAppUrl();

  const codeVerifier = getCodeVerifier();
  const storedAccessToken = localStorage.getItem("access-token");
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!storedAccessToken) {
    if (code) {
      return processLoginCallback(codeVerifier, code).then((token) => {
        window.history.replaceState({}, document.title, "/");
        localStorage.removeItem("login-redirect-count");
        return Promise.resolve(token);
      });
    }
    spotifyAuth.redirectToLoginPage(codeVerifier);
    return Promise.resolve(null);
  }

  return validateAccessToken(storedAccessToken)
    .then(() => {
      localStorage.removeItem("login-redirect-count");
      return storedAccessToken;
    })
    .catch((errorResponse) => {
      if (errorResponse.response.status === 401) {
        return refreshAccessToken(codeVerifier);
      }
      throw errorResponse;
    })
    .catch((errorResponse) => {
      invalidateCredentials(codeVerifier);
      return getAccessToken();
    });
}
