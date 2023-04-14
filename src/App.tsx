import React from "react";
import "./App.css";
import { useAuthToken } from "./turnify/useAuthToken";
import { Main } from "./turnify/Main";

function App() {
  const { accessToken } = useAuthToken();

  return (
    <div className="App">
      {accessToken && <Main token={accessToken} />}
    </div>
  );
}

export default App;
