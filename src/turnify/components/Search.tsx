import { useEffect, useState } from "react";
import {
  SearchResult,
  SpotifySearchRepository,
} from "../../infrastructure/spotify/SpotifySearchRepository";
import {
  usePlayerDevice,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";
import { SpotifyPlayerController } from "../../infrastructure/spotify/SpotifyPlayerController";

interface SearchProps {
  token: string;
}

export function Search({ token }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const search = new SpotifySearchRepository(token);
  const device = usePlayerDevice();
  const player = useSpotifyPlayer();
  const control = new SpotifyPlayerController(token, device!, player!);

  const startPlayback = (r: SearchResult) => {
    control.startPlayback(r);
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      search.search(query).then(setResults);
    }, 300);

    return () => clearTimeout(getData);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div>
        {results.map((r: SearchResult, index) => (
          <img
            src={r.artwork}
            alt={r.title}
            key={index}
            onClick={() => startPlayback(r)}
          />
        ))}
      </div>
    </div>
  );
}
