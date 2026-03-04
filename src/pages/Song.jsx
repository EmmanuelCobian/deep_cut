import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import { fetchSong } from '../lib/api/itunes';
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

function Song() {
  const { songId } = useParams();
  const { user } = useAuth();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [listeningState, setListeningState] = useState(
    LISTENING_STATES.UNPLAYED
  );

  const msToMinutesSeconds = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getYear = (date) => date.split('-')[0];

  useEffect(() => {
    const getSong = async () => {
      try {
        setLoading(true);
        const res = await fetchSong(songId);
        setSong(res.results[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getSong();
  }, [songId]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <div className={styles.header}>
        <img
          className={styles.cover}
          src={song.artworkUrl100.replace('100x100', '600x600')}
          alt={`Cover art for ${song.trackName}`}
        />

        <div className={styles.albumMeta}>
          <p className={styles.type}>Song</p>
          <h1 className={styles.title}>{song.trackName}</h1>
          <p className={styles.meta}>
            <Link to={`/artist/${song.artistId}`}>{song.artistName}</Link> •{' '}
            {getYear(song.releaseDate)}
          </p>

          <p className={styles.meta}>
            Appears on{' '}
            <Link to={`/album/${song.collectionId}`}>
              {song.collectionName}
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.leftActions}>
          <button className={styles.iconButton}>
            <img
              src={bookmarked ? bookmarkCheckFill : bookmark}
              alt="Bookmark song"
            />
          </button>

          <button className={styles.primaryButton}>
            {listeningState === LISTENING_STATES.UNPLAYED
              ? 'Create journal entry'
              : 'Edit journal entry'}
          </button>
        </div>

        <span
          className={`${styles.statusBadge} ${
            styles[listeningState.toLowerCase()]
          }`}
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

        <div className={styles.trackRow}>
          <span className={styles.trackNumber}>{1}</span>

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
      </div>
    </div>
  );
}

export default Song;
