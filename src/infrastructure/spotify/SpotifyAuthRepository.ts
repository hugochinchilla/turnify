import CryptoJS from "crypto-js";
import { ErrorResponse } from "../http/ErrorResponse";

function generateRandomString(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  return CryptoJS.SHA256(codeVerifier)
    .toString(CryptoJS.enc.Base64)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function fetchAsFormEncoded(url: string, data: Record<string, string>) {
  let body = new URLSearchParams(data);

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  }).then((response) => {
    if (!response.ok) {
      throw new ErrorResponse("HTTP status " + response.status, response);
    }
    return response.json();
  });
}

export class SpotifyAuthRepository {
  constructor(private clientId: string, private redirectUri: string) {}

  createCodeVerifier(): string {
    return generateRandomString(128);
  }

  requestAccessToken(codeVerifier: string, code: string) {
    return fetchAsFormEncoded("https://accounts.spotify.com/api/token", {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier,
    });
  }

  refreshAccessToken(refreshToken: string) {
    return fetchAsFormEncoded("https://accounts.spotify.com/api/token", {
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: refreshToken,
    });
  }

  getProfile(accessToken: string) {
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new ErrorResponse("HTTP status " + response.status, response);
      }
      return response.json();
    });
  }

  redirectToLoginPage(codeVerifier: string) {
    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "user-read-private user-read-email streaming";

      let args = new URLSearchParams({
        response_type: "code",
        client_id: this.clientId,
        scope: scope,
        redirect_uri: this.redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location.assign("https://accounts.spotify.com/authorize?" + args);
    });
  }
}
