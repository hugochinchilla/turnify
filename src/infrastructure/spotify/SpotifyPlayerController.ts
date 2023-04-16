import { PlayerDevice, usePlayerDevice } from "react-spotify-web-playback-sdk";
import { SearchResult } from "./SpotifySearchRepository";

export class SpotifyPlayerController {
  constructor(
    private accessToken: string,
    private device: PlayerDevice,
    private player: Spotify.Player
  ) {}

  startPlayback(result: SearchResult) {
    this.player.activateElement();
    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.device.device_id}`,
      {
        method: "PUT",
        body: JSON.stringify({ context_uri: result.uri }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
  }
}
