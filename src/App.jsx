import { useState, useEffect } from 'react';
import SearchBar from './shared/SearchBar';
import './App.css';

function App() {
  const ITUNES_BASE_URL = 'https://itunes.apple.com/';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const getMusic = async () => {
      if (searchQuery.length == 0) return;

      const url = `${ITUNES_BASE_URL}search?term=${encodeURIComponent(searchQuery)}&media=music&entity=album&limit=100`;
      // const url = `https://itunes.apple.com/lookup?id=1552439096&entity=album&limit=200`
      const response = await fetch(url);

      if (!response.ok) console.error(response);

      const json = await response.json();
      console.log(json.results);

      setSearchResults(json.results);
    };

    getMusic();
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
