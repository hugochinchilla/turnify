import { PlayerDevice } from "react-spotify-web-playback-sdk";
import { SearchResult } from "./SpotifySearchRepository";

export class SpotifyPlayerController {
  constructor(
    private accessToken: string,
    private device: PlayerDevice,
    private player: Spotify.Player
  ) {}

  startPlayback(result: SearchResult) {
    this.player.activateElement().then(() => {
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
    });
  }

  stopPlayback(): Promise<void> {
    return this.player.pause();
  }

  getPlayerVolume(): Promise<number> {
    return this.player.getVolume();
  }

  onPause(callback: () => void): void {
    this.player.on("player_state_changed", (playerState) => {
      if (playerState.paused) callback();
    });
  }
}
