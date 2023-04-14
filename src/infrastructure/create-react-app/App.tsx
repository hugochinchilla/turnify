import React from "react";
import "./App.css";
import { useAuthToken } from "../../turnify/hooks/useAuthToken";
import { Main } from "../../turnify/components/Main";

function App() {
  const { accessToken } = useAuthToken();

  return (
    <div className="App">
      {accessToken && <Main token={accessToken} />}
    </div>
  );
}

export default App;
