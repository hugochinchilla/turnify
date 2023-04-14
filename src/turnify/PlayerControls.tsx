import {usePlaybackState, usePlayerDevice, useSpotifyPlayer} from 'react-spotify-web-playback-sdk';
import {SpotifyPlaybackPlayer} from 'react-spotify-playback-player';
import React from 'react';

export const PlayerControls = () => {
  const device = usePlayerDevice();
  const player = useSpotifyPlayer();
  const playback = usePlaybackState();

  return (
    <SpotifyPlaybackPlayer
      playback={playback || undefined}
      player={player || undefined}
      deviceIsReady={device?.status}
    />
  );
};
