import { useAppContext } from "../contexts/AppContext";
import { useSpotifyPlayer } from "react-spotify-web-playback-sdk";

export const TrackList = () => {
  const { currentAlbum, trackList } = useAppContext();
  const player = useSpotifyPlayer();

  return (
    currentAlbum && (
      <div className={"flex justify-center align-middle grow p-4"}>
        <img
          src={currentAlbum.artwork}
          alt={currentAlbum.title}
          className={"m-4 object-contain h-48"}
        />

        <ul className={"text-slate-50 justify-center flex flex-col"}>
          {trackList.map((track) => (
            <li key={track.title}>{track.title}</li>
          ))}
        </ul>
      </div>
    )
  );
};
