import React from "react";
import "./App.css";
import { useSpotifyAuthentication } from "./useSpotifyAuthentication";
import { Player } from "./Player";

function App() {
  console.log("App");
  useSpotifyAuthentication();

  return (
    <div className="App">
      <header className="App-header"></header>
      <Player />
    </div>
  );
}

export default App;
