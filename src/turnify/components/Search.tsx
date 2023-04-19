import { SearchResult } from "../../infrastructure/spotify/SpotifySearchRepository";
import { useAppContext } from "../contexts/AppContext";

export function Search() {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <div className="form-control ">
      <div className="input-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search…"
          className="input input-bordered"
        />
        <button className="btn btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SearchResults() {
  const { searchResults, selectAlbum } = useAppContext();

  return (
    <div className={"flex justify-center"}>
      <div
        className={"p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"}
      >
        {searchResults.map((r: SearchResult, index) => (
          <img
            className={"cursor-pointer"}
            src={r.artwork}
            alt={r.title}
            key={index}
            onClick={() => selectAlbum(r)}
          />
        ))}
      </div>
    </div>
  );
}
