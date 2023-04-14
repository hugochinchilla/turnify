import CryptoJS from "crypto-js";
import { useState } from "react";

const clientId = "fd160f950e30436ebf69e14b9550cd0b";
const redirectUri = "http://127.0.0.1:7878";

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

function doLogin() {
  const codeVerifier = generateRandomString(128);
  localStorage.setItem("code-verifier", codeVerifier);

  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    let state = generateRandomString(16);
    let scope = "user-read-private user-read-email streaming";

    let args = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location.assign("https://accounts.spotify.com/authorize?" + args);
  });
}

function getAccessToken(): Promise<string> {
  const storedAccessToken = localStorage.getItem("access-token");
  if (storedAccessToken) {
    return Promise.resolve(storedAccessToken);
  }

  const codeVerifier = localStorage.getItem("code-verifier") as string;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code") as string;

  let body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("access-token", data.access_token);
      return data.access_token;
    })
}

export function useAuthToken() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  if (window.location.origin !== redirectUri) {
    window.location.assign(redirectUri);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    doLogin();
  } else {
    getAccessToken().then((token) => {
      setAccessToken(token);
    });
  }

  return {
    accessToken,
  };
}
