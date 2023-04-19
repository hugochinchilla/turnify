import React, { useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { PlayerControls } from "./PlayerControls";
import { Search, SearchResults } from "./Search";
import { TrackList } from "./TrackList";
import { AppContextProvider } from "./AppContextProvider";
import { useAppContext } from "../contexts/AppContext";
import { getAccessToken } from "../hooks/getAccessToken";
import logo from "../../assets/logo.svg";

function Turnify() {
  const { searchResults } = useAppContext();
  return (
    <div className="Turnify">
      <div className="self-start navbar bg-base-100 flex justify-between">
        <a className="btn btn-ghost normal-case text-xl">
          <img src={logo} alt="" className={"pr-2"} />
          Turnify
        </a>
        <Search />
      </div>

      {searchResults.length > 0 && <SearchResults />}
      {searchResults.length === 0 && <TrackList />}
      <PlayerControls />
    </div>
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
    <>
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
    </>
  );
}

export { Main };
