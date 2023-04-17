import { useEffect, useState } from "react";
import { SearchResult } from "../../infrastructure/spotify/SpotifySearchRepository";
import { useAppContext } from "../contexts/AppContext";

export function Search() {
  const [query, setQuery] = useState("");
  const { searchAlbum, searchResults, selectAlbum } = useAppContext();

  useEffect(() => {
    const getData = setTimeout(() => {
      searchAlbum(query);
    }, 300);

    return () => clearTimeout(getData);
  }, [query]);

  function onAlbumSelected(album: SearchResult) {
    selectAlbum(album);
    setQuery("");
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div>
        {searchResults.map((r: SearchResult, index) => (
          <img
            src={r.artwork}
            alt={r.title}
            key={index}
            onClick={() => onAlbumSelected(r)}
          />
        ))}
      </div>
    </div>
  );
}
