import { Routes, Route } from 'react-router';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import Artist from './pages/Artist';
import Album from './pages/Album';
import SidebarNav from './shared/SideBarNav';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <div>
        <SidebarNav />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/artist/:artistId" element={<Artist />} />
            <Route path="/album/:albumId" element={<Album />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
