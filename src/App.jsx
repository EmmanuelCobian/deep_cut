import { useReducer } from 'react';
import { Routes, Route } from 'react-router';
import {
  reducer as searchReducer,
  actions as searchActions,
  initialState as initialSearchState,
} from './reducers/search.reducer';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import Artist from './pages/Artist';
import './App.css';

function App() {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);

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

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/search/:query"
          element={
            <SearchResults searchState={searchState} dispatch={dispatch} />
          }
        />
        <Route
          path="/artist/:artistId"
          element={<Artist searchState={searchState} />}
        />
      </Routes>
    </>
  );
}

export default App;
