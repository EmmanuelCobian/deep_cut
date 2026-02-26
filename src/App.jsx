import { useState, useEffect } from 'react';
import { mergeArraysOfObjects } from './utils/utils';
import SearchBar from './shared/SearchBar';
import './App.css';

function App() {
  const ITUNES_BASE_URL = 'https://itunes.apple.com';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const fetchAlbums = async () => {
      const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=album&limit=100`;
      const response = await fetch(url);

      if (!response.ok) console.error(response);

      return response;
    };

    const fetchArtistId = async () => {
      const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=musicArtist&limit=5`;
      const response = await fetch(url);

      if (!response.ok) console.error(response);

      const json = await response.json();
      const artistId = json.results[0].artistId;
      return artistId;
    };

    const fetchArtistDiscography = async () => {
      const artistId = await fetchArtistId();
      const url = `${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=album&limit=200`;
      const response = await fetch(url);

      if (!response.ok) console.error(response);

      return response;
    };

    const fetchMusic = async () => {
      if (searchQuery.length == 0) return;

      const albums = await fetchAlbums();
      const albumsJson = await albums.json();

      const artistDiscography = await fetchArtistDiscography();
      const artistJson = await artistDiscography.json();

      console.log(artistJson.results)

      const mergedResults = mergeArraysOfObjects(
        albumsJson.results,
        artistJson.results.splice(1),
        'collectionId'
      );
      setSearchResults(mergedResults);
    };

    fetchMusic();
  }, [searchQuery]);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <h1>Deep Cut</h1>
      <p>search query: {searchQuery}</p>
      <div>
        {searchResults.map((res) => (
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
