import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import AlbumCard from '../shared/AlbumCard';
import SongCard from '../shared/SongCard';
import {
  fetchAllAlbumRatings,
  fetchAllTrackRatings,
} from '../lib/utils/supabase';
import { normalizeEntry, applyFilters } from '../lib/utils/utils';
import SearchIcon from '../assets/search.svg';
import styles from './Journal.module.css';

function Journal() {
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [sort, setSort] = useState('Newest first');

  const ITEMS_PER_PAGE = 12;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  useEffect(() => {
    const getEntries = async () => {
      if (userLoading || !user?.id) return;

      try {
        setLoading(true);

        const [albumEntries, trackEntries] = await Promise.all([
          fetchAllAlbumRatings(user.id),
          fetchAllTrackRatings(user.id),
        ]);

        const normalized = [
          ...albumEntries.map((album) => normalizeEntry(album, 'album')),
          ...trackEntries.map((song) => normalizeEntry(song, 'song')),
        ];

        setAllEntries(normalized);
      } catch (err) {
        console.error('Failed to fetch journal entries:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getEntries();
  }, [user?.id, userLoading]);

  const filteredEntries = useMemo(
    () => applyFilters(allEntries, { search, mediaFilter, sort }),
    [allEntries, search, mediaFilter, sort]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEntries.length / ITEMS_PER_PAGE)
  );
  const currentPage = Math.min(page, totalPages);
  const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEntries = filteredEntries.slice(
    indexOfFirst,
    indexOfFirst + ITEMS_PER_PAGE
  );

  const handleMediaFilterChange = (filter) => {
    setMediaFilter(filter);
    setSearchParams((prev) => {
      prev.set('page', '1');
      return prev;
    });
  };

  const handleAlbumClick = (album) => {
    navigate(`/album/${album.original.album_id}`);
  };

  const handleSongClick = (song) => {
    navigate(`/song/${song.original.track_id}`);
  };

  if (loading || userLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Journal</h1>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <img src={SearchIcon} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search for a journal entry"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.pills}>
          <button
            className={`${styles.pill} ${mediaFilter === 'all' ? styles.pillActive : ''}`}
            onClick={() => handleMediaFilterChange('all')}
          >
            All
          </button>
          <button
            className={`${styles.pill} ${mediaFilter === 'albums' ? styles.pillActive : ''}`}
            onClick={() => handleMediaFilterChange('albums')}
          >
            Albums
          </button>
          <button
            className={`${styles.pill} ${mediaFilter === 'songs' ? styles.pillActive : ''}`}
            onClick={() => handleMediaFilterChange('songs')}
          >
            Songs
          </button>
        </div>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="Newest first">Newest first</option>
          <option value="Oldest first">Oldest first</option>
          <option value="Highest rated">Highest rated</option>
          <option value="Lowest rated">Lowest rated</option>
        </select>
      </div>

      {currentEntries.length === 0 ? (
        <div className={styles.emptyState}>
          {allEntries.length === 0 ? (
            <>
              <p className={styles.emptyTitle}>Nothing here yet.</p>
              <p className={styles.emptyText}>
                Start a listening session on any album or song to create your
                first entry.
              </p>
            </>
          ) : (
            <>
              <p className={styles.emptyTitle}>
                No entries match your filters.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {currentEntries.map((entry) =>
            entry.type === 'album' ? (
              <AlbumCard
                key={entry.id}
                album={entry}
                onAlbumClick={() => handleAlbumClick(entry)}
              />
            ) : (
              <SongCard
                key={entry.id}
                song={entry}
                onSongClick={() => handleSongClick(entry)}
              />
            )
          )}
        </div>
      )}

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

export default Journal;
