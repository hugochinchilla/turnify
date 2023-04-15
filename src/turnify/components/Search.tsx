import { useState } from "react";
import {
  SearchResult,
  SpotifySearchRepository,
} from "../../infrastructure/spotify/SpotifySearchRepository";

interface SearchProps {
  token: string;
}

export function Search({ token }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const search = new SpotifySearchRepository(token);
  search.search(query).then(setResults);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div>
        {results.map((r: SearchResult) => (
          <img src={r.artwork} alt={r.title} />
        ))}
      </div>
    </div>
  );
}
