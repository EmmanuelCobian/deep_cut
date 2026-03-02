import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { fetchAlbum } from '../lib/api/itunes';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import styles from './Album.module.css';
import bookmark from '../assets/bookmark.svg';
import bookmarkCheckFill from '../assets/bookmark-check-fill.svg';

const LISTENING_STATES = {
  UNPLAYED: 'Unplayed',
  LISTENING: 'Listening',
  LISTENED: 'Listened',
};

function Album() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [listeningState, setListeningState] = useState(
    LISTENING_STATES.UNPLAYED
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const msToHoursMinutes = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;
  };

  const msToMinutesSeconds = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getYear = (date) => {
    return date.split('-')[0];
  };

  const getAlbumRuntime = (songs) => {
    const total = songs.reduce((acc, song) => acc + song.trackTimeMillis, 0);
    return msToHoursMinutes(total);
  };

  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked);
  };

  useEffect(() => {
    const getAlbum = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAlbum(albumId);
        const [header, ...rest] = res.results;
        setAlbum({ ...header, runtime: getAlbumRuntime(rest) });
        setSongs(rest);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch album: ${error}`);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getAlbum();
  }, [albumId]);

  if (isLoading) return <Loading />;

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <img
          className={styles.cover}
          src={album.artworkUrl100.replace('100x100', '600x600')}
          alt={`Cover art for ${album.collectionName}`}
        />

        <div className={styles.albumMeta}>
          <p className={styles.type}>Album</p>
          <h1 className={styles.title}>{album.collectionName}</h1>
          <p className={styles.meta}>
            {album.artistName} • {getYear(album.releaseDate)} •{' '}
            {album.trackCount} songs • {album.runtime}
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.leftActions}>
          <button className={styles.iconButton} onClick={handleBookmarkClick}>
            <img
              src={bookmarked ? bookmarkCheckFill : bookmark}
              alt="Bookmark album"
            />
          </button>

          <button className={styles.primaryButton}>
            {listeningState === LISTENING_STATES.UNPLAYED
              ? 'Create journal entry'
              : 'Edit journal entry'}
          </button>
        </div>

        <span
          className={`${styles.statusBadge} ${styles[listeningState.toLowerCase()]}`}
        >
          {listeningState}
        </span>
      </div>

      <div className={styles.trackList}>
        <div className={styles.trackHeader}>
          <span>#</span>
          <span>Title</span>
          <span className={styles.durationHeader}>Duration</span>
        </div>

        {songs.map((song, idx) => (
          <div key={song.trackId} className={styles.trackRow}>
            <span className={styles.trackNumber}>{idx + 1}</span>

            <div className={styles.trackInfo}>
              <p className={styles.trackName}>{song.trackName}</p>
              <p className={styles.trackArtist}>
                {song.contentAdvisoryRating === 'Explicit' && (
                  <span className={styles.explicit}>E</span>
                )}
                {song.artistName}
              </p>
            </div>

            <span className={styles.duration}>
              {msToMinutesSeconds(song.trackTimeMillis)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Album;
