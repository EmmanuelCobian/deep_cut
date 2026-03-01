import { Routes, Route } from 'react-router';
import Header from './shared/Header';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import Artist from './pages/Artist';
import Album from './pages/Album';
import SidebarNav from './shared/SidebarNav';
import NotFound from './pages/NotFound';
import AuthGuard from './shared/AuthGuard';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <div className='gridContainer'>
        <SidebarNav />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/artist/:artistId" element={<Artist />} />
            <Route path="/album/:albumId" element={<Album />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/journal"
              element={
                <AuthGuard>
                  <div>Journal</div>
                </AuthGuard>
              }
            />
            <Route
              path="/lists"
              element={
                <AuthGuard>
                  <div>Listen Lists</div>
                </AuthGuard>
              }
            />
            <Route
              path="/account"
              element={
                <AuthGuard>
                  <div>Account</div>
                </AuthGuard>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
