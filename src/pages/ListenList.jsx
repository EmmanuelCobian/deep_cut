import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useNavigate } from 'react-router';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import SongCard from '../shared/SongCard';
import AlbumCard from '../shared/AlbumCard';
import { fetchListenList } from '../lib/utils/supabase';
import { normalizeEntry, applyFilters } from '../lib/utils/utils';
import SearchIcon from '../assets/search.svg';
import styles from './ListenList.module.css';

function ListenList() {
  const [allEntries, setAllEntries] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [sort, setSort] = useState('Newest first');

  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getListeningList = async () => {
      if (userLoading || !user?.id) return;

      try {
        setListLoading(true);

        const list = await fetchListenList(user.id);

        const normalized = [
          ...list
            .filter((media) => media.media_type === 'album')
            .map((e) => normalizeEntry(e, 'album')),
          ...list
            .filter((media) => media.media_type === 'song')
            .map((e) => normalizeEntry(e, 'song')),
        ];

        setAllEntries(normalized);
      } catch (error) {
        console.error(`Failed to fetch listening list: ${error}`);
        setError(error.message);
      } finally {
        setListLoading(false);
      }
    };

    getListeningList();
  }, [user?.id, userLoading]);

  const filteredEntries = useMemo(
    () => applyFilters(allEntries, { search, mediaFilter, sort }),
    [allEntries, search, mediaFilter, sort]
  );

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  if (listLoading || userLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Listen List</h1>

      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <img src={SearchIcon} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search for a song or album"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.pills}>
          <button
            className={`${styles.pill} ${mediaFilter === 'all' ? styles.pillActive : ''}`}
            onClick={() => setMediaFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.pill} ${mediaFilter === 'albums' ? styles.pillActive : ''}`}
            onClick={() => setMediaFilter('albums')}
          >
            Albums
          </button>
          <button
            className={`${styles.pill} ${mediaFilter === 'songs' ? styles.pillActive : ''}`}
            onClick={() => setMediaFilter('songs')}
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
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <div className={styles.emptyState}>
          {allEntries.length === 0 ? (
            <>
              <p className={styles.emptyTitle}>Nothing here yet.</p>
              <p className={styles.emptyText}>
                Bookmark a song or album and it will appear here.
              </p>
            </>
          ) : (
            <p>No entries match your filters</p>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredEntries.map((entry) =>
            entry.type === 'album' ? (
              <AlbumCard
                key={entry.id}
                album={entry}
                onAlbumClick={() => handleAlbumClick(entry.id)}
              />
            ) : (
              <SongCard
                key={entry.id}
                song={entry}
                onSongClick={() => handleSongClick(entry.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default ListenList;
