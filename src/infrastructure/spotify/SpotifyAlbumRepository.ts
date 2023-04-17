import { ErrorResponse } from "../http/ErrorResponse";

export interface Track {
  title: string;
  durationSeconds: number;
  trackNumber: number;
  isPlayable: boolean;
  uri: string;
}

export class SpotifyAlbumRepository {
  constructor(private accessToken: string) {}

  getAlbumTracks(albumId: string): Promise<Track[]> {
    return fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
      headers: {
        Authorization: "Bearer " + this.accessToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new ErrorResponse("HTTP status " + response.status, response);
        }
        return response.json();
      })
      .then((data) => {
        return data.items.map((item: any) => ({
          title: item.name,
          durationSeconds: Math.round(item.duration_ms / 1000),
          trackNumber: item.track_number,
          isPlayable: item.is_playable,
          uri: item.uri,
        }));
      });
  }
}
