import { SpotifyAuthRepository } from "../../infrastructure/spotify/SpotifyAuthRepository";

const REDIRECT_TO_LOGIN_PAGE = "Redirecting to Spotify login page";
const REDIRECT_TO_MAIN_APP_URL = "Redirecting to home page";

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
  return spotifyAuth
    .refreshAccessToken(refreshToken)
    .then((response) => {
      localStorage.setItem("access-token", response.access_token);
      localStorage.setItem("refresh-token", response.refresh_token);
      return response.access_token;
    })
    .catch((errorResponse) => {
      if (errorResponse.response.status === 400) {
        invalidateCredentials(codeVerifier);
      }

      throw errorResponse;
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

function goToSpotifyLoginPage(codeVerifier: string): void {
  let redirectCount = parseInt(
    localStorage.getItem("login-redirect-count") || "0"
  );

  if (redirectCount > 2) {
    throw new Error("redirect loop detected");
  }

  redirectCount++;
  localStorage.setItem("login-redirect-count", redirectCount.toString());
  spotifyAuth.redirectToLoginPage(codeVerifier);
}

export function getAccessToken(): Promise<string> {
  forceValidAppUrl();

  const codeVerifier = getCodeVerifier();
  const storedAccessToken = localStorage.getItem("access-token");
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!storedAccessToken) {
    if (code) {
      return processLoginCallback(codeVerifier, code).then((token) => {
        window.history.replaceState({}, document.title, "/");
        return Promise.resolve(token);
      });
    }
    goToSpotifyLoginPage(codeVerifier);
    return Promise.reject(new Error(REDIRECT_TO_LOGIN_PAGE));
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
      invalidateCredentials(codeVerifier);
      goToSpotifyLoginPage(codeVerifier);
      throw errorResponse;
    });
}
