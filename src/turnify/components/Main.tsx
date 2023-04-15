import React from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { PlayerControls } from "./PlayerControls";
import { Search } from "./Search";

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
        <Search token={token} />
        <PlayerControls />
      </WebPlaybackSDK>
    </div>
  );
}

export { Main };
