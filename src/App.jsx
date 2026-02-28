import { useState, useEffect } from 'react';
import { fetchAlbums, fetchArtists } from './api/itunes';
import SearchBar from './shared/SearchBar';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [artistResults, setArtistResults] = useState([]);
  const [albumResults, setAlbumResults] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(-1);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchMusic = async () => {
      if (searchQuery.length === 0) return;

      try {
        const [albums, artists] = await Promise.all([
          fetchAlbums(searchQuery),
          fetchArtists(searchQuery),
        ]);

        setAlbumResults(albums);
        setArtistResults(artists);
      } catch (error) {
        console.error('Failed to fetch music:', error);
      }
    };

    fetchMusic();
  }, [searchQuery]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <h1>Deep Cut</h1>
      <div>
        {artistResults.map((artist) => (
          <div key={artist.artistId}>
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
        {albumResults.map((res) => (
          <div key={res.collectionId}>
            <p>{res.artistName}</p>
            <p>{res.collectionName}</p>
            <img
              src={res.artworkUrl100}
              alt={`Cover art for ${res.collectionName}`}
            />
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
