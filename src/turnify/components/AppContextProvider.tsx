import React from "react";
import {
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { AppContext, useCreateAppContext } from "../contexts/AppContext";

interface AppContextProviderProps {
  token: string;
  children: React.ReactNode;
}

export function AppContextProvider({
  token,
  children,
}: AppContextProviderProps) {
  const device = usePlayerDevice();
  const player = useSpotifyPlayer();

  const value = useCreateAppContext(token, device!, player!);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
