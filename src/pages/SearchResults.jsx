import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { fetchAlbums, fetchArtists } from '../lib/api/itunes';
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';
import AlbumCard from '../shared/AlbumCard';
import ArtistCard from '../shared/ArtistCard';

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
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <div>
        <h2>Artists</h2>
        {artists.map((artist) => (
          <div
            key={artist.artistId}
            onClick={(e) => handleArtistClick(e, artist)}
          >
            <ArtistCard artist={artist} />
          </div>
        ))}
      </div>

      <hr />

      <div>
        <h2>Albums</h2>
        {albums.map((album) => (
          <div
            key={album.collectionId}
            onClick={() => handleAlbumClick(album.collectionId)}
          >
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchResults;
