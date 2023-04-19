import React, { useEffect, useState } from "react";
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
import crackle from "../../assets/vinyl-crackle.mp3";

export interface App {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  trackList: Track[];
  currentAlbum: SearchResult | null;
  searchResults: SearchResult[];
  selectAlbum: (album: SearchResult) => void;
  searchAlbum: (query: string) => void;
}

const featureToggles = {
  vinylHiss: true,
};

export const AppContext = React.createContext<App | null>(null);

export function useAppContext() {
  const value = React.useContext(AppContext);

  if (value === null) {
    throw new Error("Not wrapped in app context");
  }

  return value;
}

function wait(time_ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time_ms);
  });
}

function fadeOut(audio: HTMLAudioElement): Promise<void> {
  let steps = 100;
  const tick = 50;

  return new Promise((resolve) => {
    const stepDown = () => {
      audio.volume = audio.volume * 0.98;
      steps = steps - 1;

      if (steps > 0) {
        setTimeout(stepDown, tick);
      } else {
        resolve();
      }
    };

    stepDown();
  });
}

function startPlayback(control: SpotifyPlayerController, album: SearchResult) {
  if (!featureToggles.vinylHiss) {
    control.startPlayback(album);
    return;
  }

  const audio = new Audio(crackle);

  control
    .stopPlayback()
    .then(() => control.getPlayerVolume())
    .then((volume) => (audio.volume = volume))
    .then(() => audio.play())
    .then(() => wait(3_000))
    .then(() => control.startPlayback(album))
    .then(() => wait(10_000))
    .then(() => fadeOut(audio))
    .then(() => audio.pause());

  control.onPause(() => audio.pause());
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
  const [searchQuery, setSearchQuery] = useState("");

  function selectAlbum(album: SearchResult) {
    setCurrentAlbum(album);
    setSearchResults([]);
    setSearchQuery("");
    albumRepository.getAlbumTracks(album.id).then(setTrackList);
    startPlayback(control, album);
  }

  function searchAlbum(query: string) {
    search.search(query).then(setSearchResults);
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      searchAlbum(searchQuery);
    }, 300);

    return () => clearTimeout(getData);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    trackList,
    currentAlbum,
    searchResults,
    selectAlbum,
    searchAlbum,
  };
}
