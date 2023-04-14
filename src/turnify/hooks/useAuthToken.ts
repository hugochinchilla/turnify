import { useState } from "react";
import { SpotifyAuthRepository } from "../../infrastructure/spotify/SpotifyAuthRepository";

const clientId = "fd160f950e30436ebf69e14b9550cd0b";
const redirectUri = "http://127.0.0.1:7878";
const spotifyAuth = new SpotifyAuthRepository(clientId, redirectUri);

function forceValidAppUrl() {
  if (window.location.origin !== redirectUri) {
    window.location.assign(redirectUri);
  }
}

function getCodeVerifier(): string {
  let codeVerifier = localStorage.getItem("code-verifier");
  if (!codeVerifier) {
    codeVerifier = spotifyAuth.createCodeVerifier();
    localStorage.setItem("code-verifier", codeVerifier);
  }

  return codeVerifier;
}

function getAccessToken(
  code: string,
  codeVerifier: string
): Promise<undefined | string> {
  const storedAccessToken = localStorage.getItem("access-token");
  if (storedAccessToken) {
    return spotifyAuth
      .getProfile(storedAccessToken)
      .then(() => {
        return storedAccessToken;
      })
      .catch((errorResponse) => {
        if (errorResponse.response.status === 401) {
          localStorage.removeItem("access-token");
          spotifyAuth.redirectToLoginPage(codeVerifier);
          return undefined;
        }
      });
  }

  return spotifyAuth.requestAccessToken(codeVerifier, code).then((response) => {
    localStorage.setItem("access-token", response.access_token);
    localStorage.setItem("refresh-token", response.refresh_token);
    return response.access_token;
  });
}

export function useAuthToken() {
  forceValidAppUrl();

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const codeVerifier = getCodeVerifier();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    spotifyAuth.redirectToLoginPage(codeVerifier);
  } else {
    getAccessToken(code, codeVerifier)
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
  }

  return {
    accessToken,
  };
}
