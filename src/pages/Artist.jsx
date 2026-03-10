import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { fetchArtistDiscography } from '../lib/api/itunes';
import { normalizeAlbum } from '../lib/utils/utils';
import AlbumCard from '../shared/AlbumCard';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import styles from './Artist.module.css';

function Artist() {
  const { artistId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [discography, setDiscography] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const ITEMS_PER_PAGE = 12;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const determineCollectionType = (collection) => {
    const tracks = collection.trackCount;
    if (tracks <= 6) {
      return 'singles';
    } else {
      return 'albums';
    }
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDiscography.length / ITEMS_PER_PAGE)
  );
  const currentPage = Math.min(page, totalPages);
  const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEntries = filteredDiscography.slice(
    indexOfFirst,
    indexOfFirst + ITEMS_PER_PAGE
  );

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
    setSearchParams((prev) => {
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      prev.set('page', String(page));
      return prev;
    });
  };

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
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>

        <button
          className={`${styles.pill} ${filter === 'albums' ? styles.active : ''}`}
          onClick={() => handleFilterChange('albums')}
        >
          Albums
        </button>

        <button
          className={`${styles.pill} ${filter === 'singles' ? styles.active : ''}`}
          onClick={() => handleFilterChange('singles')}
        >
          Singles & EPs
        </button>
      </div>

      <div className={styles.albumContainer}>
        {currentEntries.map((album) => (
          <div key={album.collectionId}>
            <AlbumCard
              album={normalizeAlbum(album)}
              onAlbumClick={() => handleAlbumClick(album.collectionId)}
            />
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className={styles.pageNumbers}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Artist;
