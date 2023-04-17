import { ErrorResponse } from "../http/ErrorResponse";

export enum ResultType {
  ALBUM,
  ARTIST,
}

export interface SearchResult {
  id: string;
  title: string;
  artwork: string;
  type: ResultType;
  uri: string;
}

export class SpotifySearchRepository {
  constructor(private accessToken: string) {}

  search(query: string): Promise<Array<SearchResult>> {
    if (!query) {
      return Promise.resolve([]);
    }

    const args = new URLSearchParams({
      q: query,
      type: "album",
      market: "ES",
      limit: "10",
      offset: "0",
    });

    return fetch("https://api.spotify.com/v1/search?" + args, {
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
        return data.albums.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          artwork: item.images[1].url,
          type: ResultType.ALBUM,
          uri: item.uri,
        }));
      });
  }
}
