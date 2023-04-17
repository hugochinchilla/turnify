import { useAppContext } from "../contexts/AppContext";

export const TrackList = () => {
  const { currentAlbum, trackList } = useAppContext();

  return (
    currentAlbum && (
      <div>
        <img src={currentAlbum.artwork} alt={currentAlbum.title} />
        <ul>
          {trackList.map((track) => (
            <li key={track.trackNumber}>{track.title}</li>
          ))}
        </ul>
      </div>
    )
  );
};
