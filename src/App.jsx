import { useEffect, useReducer } from 'react';
import {
  reducer as searchReducer,
  actions as searchActions,
  initialState as initialSearchState,
} from './reducers/search.reducer';
import {
  fetchAlbums,
  fetchArtists,
  fetchArtistDiscography,
} from './api/itunes';
import SearchBar from './shared/SearchBar';
import './App.css';

function App() {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);

  const handleSearch = (query) => {
    dispatch({ type: searchActions.changeSearchQuery, searchQuery: query });
  };

  const handleArtistClick = (event, artist) => {
    event.preventDefault();
    dispatch({
      type: searchActions.changeArtistId,
      selectedArtistId: artist.artistId,
    });
  };

  useEffect(() => {
    const getDiscography = async () => {
      if (searchState.selectedArtistId === -1) return;

      try {
        dispatch({ type: searchActions.fetchDiscography });
        const discography = await fetchArtistDiscography(
          searchState.selectedArtistId
        );
        dispatch({
          type: searchActions.fetchDiscographySuccess,
          discography: discography.results,
        });
      } catch (error) {
        console.error(`Failed to fetch discography: ${error}`);
        dispatch({ type: searchActions.fetchDiscographyFailure, error: error });
      }
    };

    getDiscography();
  }, [searchState.selectedArtistId]);

  useEffect(() => {
    const getSearchResults = async () => {
      if (searchState.searchQuery.length === 0) return;

      try {
        dispatch({ type: searchActions.fetchSearchResults });
        const [albums, artists] = await Promise.all([
          fetchAlbums(searchState.searchQuery),
          fetchArtists(searchState.searchQuery),
        ]);
        dispatch({
          type: searchActions.fetchSearchResultsSuccess,
          albums: albums,
          artists: artists,
        });
      } catch (error) {
        console.error(`Failed to fetch music: ${error}`);
        dispatch({
          type: searchActions.fetchSearchResultsFailure,
          error: error,
        });
      }
    };

    getSearchResults();
  }, [searchState.searchQuery]);

  if (searchState.error) {
    return (
      <div>
        <p>{searchState.error}</p>
        <button onClick={() => dispatch({ type: searchActions.clearError })}>
          Clear error message
        </button>
      </div>
    );
  }

  if (searchState.isLoading) {
    return <p>loading...</p>;
  }

  if (
    searchState.selectedArtistId > -1 &&
    searchState.artistDiscography.length > 0
  ) {
    return (
      <div>
        <h1>{searchState.artistDiscography[0].artistName}</h1>
        {searchState.artistDiscography.slice(1).map((album) => (
          <div key={album.collectionId}>
            <p>{album.collectionName}</p>
            <img
              src={album.artworkUrl100}
              alt={`Cover art for ${album.collectionName}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <h1>Deep Cut</h1>

      <div>
        {searchState.artists.map((artist) => (
          <div
            key={artist.artistId}
            onClick={(e) => handleArtistClick(e, artist)}
          >
            <p>{artist.artistName}</p>
            {artist.artwork && (
              <img
                src={artist.artwork}
                alt={`Artwork for ${artist.artistName}`}
              />
            )}
            <hr />
          </div>
        ))}
      </div>

      <hr />

      <div>
        {searchState.albums.map((album) => (
          <div key={album.collectionId}>
            <p>{album.artistName}</p>
            <p>{album.collectionName}</p>
            <img
              src={album.artworkUrl100}
              alt={`Cover art for ${album.collectionName}`}
            />
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
