import React from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { PlayerControls } from "./PlayerControls";
import { Search } from "./Search";
import { TrackList } from "./TrackList";
import { AppContextProvider } from "./AppContextProvider";
import { useAppContext } from "../contexts/AppContext";

interface MainProps {
  token: string;
}

function Turnify() {
  const { searchResults } = useAppContext();
  return (
    <>
      <Search />
      {searchResults.length === 0 && <TrackList />}
      <PlayerControls />
    </>
  );
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
        <AppContextProvider token={token}>
          <Turnify />
        </AppContextProvider>
      </WebPlaybackSDK>
    </div>
  );
}

export { Main };
