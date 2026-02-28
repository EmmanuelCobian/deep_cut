import { Routes, Route } from 'react-router';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import Artist from './pages/Artist';
import './App.css';

function App() {return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/search/:query"
          element={
            <SearchResults />
          }
        />
        <Route
          path="/artist/:artistId"
          element={<Artist />}
        />
      </Routes>
    </>
  );
}

export default App;
