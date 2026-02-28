import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { fetchArtistDiscography } from '../api/itunes';

function Artist() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [discography, setDiscography] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  useEffect(() => {
    const getDiscography = async () => {
      try {
        setIsLoading(true);
        const res = await fetchArtistDiscography(artistId);
        const [artist, ...albums] = res.results;
        setArtist(artist)
        const sorted = [...albums].sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        setDiscography(sorted);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch discography: ${error}`);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getDiscography();
  }, [artistId]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to={'/'}>Go back home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{artist.artistName}</h1>
      {discography.slice(1).map((album) => (
        <div
          key={album.collectionId}
          onClick={() => handleAlbumClick(album.collectionId)}
        >
          <p>{album.collectionName}</p>
          <img
            src={album.artworkUrl100}
            alt={`Cover art for ${album.collectionName}`}
          />
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Artist;
