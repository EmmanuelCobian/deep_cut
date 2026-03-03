import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { fetchArtistDiscography } from '../lib/api/itunes';
import AlbumCard from '../shared/AlbumCard';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import styles from './Artist.module.css';

function Artist() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [discography, setDiscography] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const determineCollectionType = (collection) => {
    const tracks = collection.trackCount;
    if (tracks <= 6) {
      return 'singles';
    } else {
      return 'albums';
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  useEffect(() => {
    const getDiscography = async () => {
      try {
        setIsLoading(true);
        const res = await fetchArtistDiscography(artistId);
        const [artist, ...albums] = res.results;
        setArtist(artist);
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

  const filteredDiscography = useMemo(() => {
    if (filter === 'all') return discography;

    return discography.filter(
      (collection) => determineCollectionType(collection) === filter
    );
  }, [discography, filter]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className={styles.artistContainer}>
      <h1>{artist.artistName}</h1>

      <div className={styles.pillContainer}>
        <button
          className={`${styles.pill} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>

        <button
          className={`${styles.pill} ${filter === 'albums' ? styles.active : ''}`}
          onClick={() => setFilter('albums')}
        >
          Albums
        </button>

        <button
          className={`${styles.pill} ${filter === 'singles' ? styles.active : ''}`}
          onClick={() => setFilter('singles')}
        >
          Singles & EPs
        </button>
      </div>

      <div className={styles.albumContainer}>
        {filteredDiscography.map((album) => (
          <div key={album.collectionId}>
            <AlbumCard
              album={album}
              onAlbumClick={() => handleAlbumClick(album.collectionId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Artist;
