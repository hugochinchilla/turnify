import React from "react";
import "./App.css";
import { useSpotifyAuthentication } from "./useSpotifyAuthentication";
import { Player } from "./Player";

function App() {
  const { accessToken } = useSpotifyAuthentication();

  return (
    <div className="App">
      <header className="App-header">
        {accessToken && <Player token={accessToken} />}
      </header>
    </div>
  );
}

export default App;
