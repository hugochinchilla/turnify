import React, { useState } from "react";
import {
  SpotifyAlbumRepository,
  Track,
} from "../../infrastructure/spotify/SpotifyAlbumRepository";
import {
  SearchResult,
  SpotifySearchRepository,
} from "../../infrastructure/spotify/SpotifySearchRepository";
import { PlayerDevice } from "react-spotify-web-playback-sdk";
import { SpotifyPlayerController } from "../../infrastructure/spotify/SpotifyPlayerController";

export interface App {
  trackList: Track[];
  currentAlbum: SearchResult | null;
  searchResults: SearchResult[];
  selectAlbum: (album: SearchResult) => void;
  searchAlbum: (query: string) => void;
}

export const AppContext = React.createContext<App | null>(null);

export function useAppContext() {
  const value = React.useContext(AppContext);

  if (value === null) {
    throw new Error("Not wrapped in app context");
  }

  return value;
}

export function useCreateAppContext(
  token: string,
  device: PlayerDevice,
  player: Spotify.Player
) {
  const albumRepository = new SpotifyAlbumRepository(token);
  const control = new SpotifyPlayerController(token, device!, player!);
  const search = new SpotifySearchRepository(token);

  const [trackList, setTrackList] = useState<Track[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<null | SearchResult>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  function selectAlbum(album: SearchResult) {
    setCurrentAlbum(album);
    albumRepository.getAlbumTracks(album.id).then(setTrackList);
    control.startPlayback(album);
    setSearchResults([]);
  }

  function searchAlbum(query: string) {
    search.search(query).then(setSearchResults);
  }

  return {
    trackList,
    currentAlbum,
    searchResults,
    selectAlbum,
    searchAlbum,
  };
}
