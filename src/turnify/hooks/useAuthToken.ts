import { useState } from "react";
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

function cleanupAppUri() {
  window.location.assign(redirectUri);
  throw new Error("redirecting to clean app uri");
}

function getCodeVerifier(): string {
  let codeVerifier = localStorage.getItem("code-verifier");
  if (!codeVerifier) {
    codeVerifier = spotifyAuth.createCodeVerifier();
    localStorage.setItem("code-verifier", codeVerifier);
  }

  return codeVerifier;
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
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        spotifyAuth.redirectToLoginPage(codeVerifier);
      }
    });
}

function validateAccessToken(accessToken: string) {
  return spotifyAuth.getProfile(accessToken);
}

function getAccessToken(codeVerifier: string): Promise<undefined | string> {
  const storedAccessToken = localStorage.getItem("access-token");
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (storedAccessToken) {
    return validateAccessToken(storedAccessToken)
      .then(() => {
        return storedAccessToken;
      })
      .catch((errorResponse) => {
        if (errorResponse.response.status === 401) {
          return refreshAccessToken(codeVerifier);
        }
      })
      .then((accessToken) => {
        if (code) cleanupAppUri();
        return accessToken;
      });
  }

  if (code) {
    spotifyAuth.requestAccessToken(codeVerifier, code).then((response) => {
      localStorage.setItem("access-token", response.access_token);
      localStorage.setItem("refresh-token", response.refresh_token);
      cleanupAppUri();
    });
  }

  spotifyAuth.redirectToLoginPage(codeVerifier);

  return Promise.resolve(undefined);
}

export function useAuthToken() {
  forceValidAppUrl();

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const codeVerifier = getCodeVerifier();

  getAccessToken(codeVerifier)
    .then(setAccessToken)
    .catch((errorResponse) => {
      errorResponse.response.json().then((response: any) => {
        if (response.error === "invalid_grant") {
          spotifyAuth.redirectToLoginPage(codeVerifier);
        } else {
          throw errorResponse;
        }
      });
    });

  return {
    accessToken,
  };
}
