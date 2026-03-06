import { Routes, Route } from 'react-router';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Song from './pages/Song';
import NotFound from './pages/NotFound';
import AuthGuard from './shared/AuthGuard';
import Login from './pages/Login';
import ListenList from './pages/ListenList';
import Journal from './pages/Journal';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/artist/:artistId" element={<Artist />} />
          <Route path="/album/:albumId" element={<Album />} />
          <Route path="/song/:songId" element={<Song />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/journal"
            element={
              <AuthGuard>
                <Journal />
              </AuthGuard>
            }
          />
          <Route
            path="/lists"
            element={
              <AuthGuard>
                <ListenList />
              </AuthGuard>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
