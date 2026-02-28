import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchAlbums, fetchArtists } from '../api/itunes';

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleArtistClick = (e, artist) => {
    e.preventDefault();
    navigate(`/artist/${artist.artistId}`);
  };

  const handleErrorClick = (e) => {
    e.preventDefault();
    setError('');
    navigate('/');
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0) return;

      try {
        setIsLoading(true);

        const [albums, artists] = await Promise.all([
          fetchAlbums(query),
          fetchArtists(query),
        ]);

        setAlbums(albums);
        setArtists(artists);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch music: ${error}`);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getSearchResults();
  }, [query]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={handleErrorClick}>Clear error message</button>
      </div>
    );
  }

  return (
    <>
      <div>
        {artists.map((artist) => (
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
        {albums.map((album) => (
          <div
            key={album.collectionId}
            onClick={() => handleAlbumClick(album.collectionId)}
          >
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

export default SearchResults;
