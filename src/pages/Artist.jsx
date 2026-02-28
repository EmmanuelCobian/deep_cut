import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchArtistDiscography } from '../api/itunes';

function Artist() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [discography, setDiscography] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleErrorClick = (e) => {
    e.preventDefault();
    setError('');
    navigate('/');
  };

  useEffect(() => {
    const getDiscography = async () => {
      try {
        setIsLoading(true);

        const res = await fetchArtistDiscography(artistId);
        const sorted = [...res.results].sort(
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
        <button onClick={handleErrorClick}>Clear error message</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{discography[0].artistName}</h1>
      {discography.slice(1).map((album) => (
        <div key={album.collectionId}>
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
