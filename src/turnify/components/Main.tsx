import React, { useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { PlayerControls } from "./PlayerControls";
import { Search } from "./Search";
import { TrackList } from "./TrackList";
import { AppContextProvider } from "./AppContextProvider";
import { useAppContext } from "../contexts/AppContext";
import { getAccessToken } from "../hooks/getAccessToken";

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

function Main() {
  const [token, setToken] = useState<string | null>(null);

  function getAuthToken(callback: any) {
    getAccessToken().then((accessToken) => {
      callback(accessToken);
      setToken(accessToken);
    });
  }

  return (
    <div className="">
      {/* @ts-ignore */}
      <WebPlaybackSDK
        initialDeviceName="Turnify"
        getOAuthToken={getAuthToken}
        initialVolume={0.5}
      >
        <AppContextProvider token={token!}>
          <Turnify />
        </AppContextProvider>
      </WebPlaybackSDK>
    </div>
  );
}

export { Main };
