import { useEffect, useReducer } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import {
  reducer as searchReducer,
  actions as searchActions,
  initialState as initialSearchState,
} from './reducers/search.reducer';
import { fetchArtistDiscography } from './api/itunes';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import './App.css';

function App() {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
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
      <Header onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/search/:query"
          element={
            <SearchResults
              searchState={searchState}
              dispatch={dispatch}
              handleArtistClick={handleArtistClick}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
