import React, { useCallback } from "react";
import { SpotifyPlaybackPlayer } from "react-spotify-playback-player";
import {
  WebPlaybackSDK,
  usePlayerDevice,
  usePlaybackState,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";

interface PlayerProps {
  token: string;
}

const PlayerUI = () => {
  const device = usePlayerDevice();
  const player = useSpotifyPlayer();
  const playback = usePlaybackState();

  console.log("player:", player);
  console.log("playback:", playback);

  return (
    <SpotifyPlaybackPlayer
      playback={playback || undefined}
      player={player || undefined}
      deviceIsReady={device?.status}
    >
      Player
    </SpotifyPlaybackPlayer>
  );
};

const SongTitle = ()=> {
  const playbackState = usePlaybackState();

  if (playbackState === null) return <p>no song.</p>;

  return <p>Current song: {playbackState.track_window.current_track.name}</p>;
};

function Player({ token }: PlayerProps) {
  const getOAuthToken = useCallback(
    (callback: (arg0: string) => any) =>
      callback(token?.replace("Bearer", "").trim()),
    [token]
  );
  return (
    <div className="Player">
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="Turntablify"
        getOAuthToken={getOAuthToken}
        initialVolume={0.5}
      >
        <PlayerUI />
        <SongTitle />
      </WebPlaybackSDK>
    </div>
  );
}

export { Player };
