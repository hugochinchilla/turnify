import React from "react";
import {usePlaybackState, WebPlaybackSDK,} from "react-spotify-web-playback-sdk";
import {PlayerControls} from './PlayerControls';


const SongTitle = ()=> {
  const playbackState = usePlaybackState();

  if (playbackState === null) {
    return <p>no song</p>;
  }

  return <p>Current song: {playbackState.track_window.current_track.name}</p>;
};

interface MainProps {
  token: string;
}

function Main({ token }: MainProps) {
  return (
    <div className="">
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="Turntablify"
        getOAuthToken={(callback) => callback(token)}
        initialVolume={0.5}
      >
        <SongTitle />
        <PlayerControls />
      </WebPlaybackSDK>
    </div>
  );
}

export { Main };
