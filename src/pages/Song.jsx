import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import { fetchSong } from '../lib/api/itunes';
import {
  fetchListenList,
  insertListenList,
  deleteListenList,
  fetchTrackRating,
  upsertTrackRating,
} from '../lib/utils/supabase';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import ReviewSection from '../shared/ReviewSection';
import bookmark from '../assets/bookmark.svg';
import bookmarkCheckFill from '../assets/bookmark-check-fill.svg';
import styles from './Song.module.css';

const LISTENING_STATES = {
  UNPLAYED: 'Unplayed',
  LISTENING: 'Listening',
  LISTENED: 'Listened',
};

function Song() {
  const { songId } = useParams();
  const { user, loading: userLoading } = useAuth();

  const [song, setSong] = useState(null);
  const [songRating, setSongRating] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  const [listeningState, setListeningState] = useState(
    LISTENING_STATES.UNPLAYED
  );

  const [songLoading, setSongLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [songRatingLoading, setSongRatingLoading] = useState(true);
  const [error, setError] = useState('');

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
        setSongLoading(true);

        const res = await fetchSong(songId);

        setSong(res.results[0]);
      } catch (err) {
        console.error(`Failed to fetch song: ${error}`);
        setError(err.message);
      } finally {
        setSongLoading(false);
      }
    };

    getSong();
  }, [songId]);

  useEffect(() => {
    const getListenList = async () => {
      if (!user || userLoading) return;

      try {
        setListLoading(true);

        const listenList = await fetchListenList(user.id);
        const isBookmarked = listenList.some(
          (item) => item.media_id === songId
        );

        setBookmarked(isBookmarked);
      } catch (error) {
        console.error(`Failed to fetch listening list: ${error}`);
        setError(error.message);
      } finally {
        setListLoading(false);
      }
    };

    getListenList();
  }, [user, userLoading, songId]);

  useEffect(() => {
    const getRating = async () => {
      if (!user || userLoading || !song) return;

      try {
        setSongRatingLoading(true);

        const rating = await fetchTrackRating(user.id, song.trackId);

        setSongRating(rating);

        if (rating?.rating || rating?.thoughts) {
          setListeningState(LISTENING_STATES.LISTENED);
        } else if (rating?.listened === false) {
          setListeningState(LISTENING_STATES.LISTENING);
        } else {
          setListeningState(LISTENING_STATES.UNPLAYED);
        }
      } catch (error) {
        console.error(`Failed to fetch song rating: ${error}`);
        setError(error.message);
      } finally {
        setSongRatingLoading(false);
      }
    };

    getRating();
  }, [user, userLoading, song]);

  const handleBookmarkClick = async () => {
    if (!user) return;

    try {
      if (!bookmarked) {
        setBookmarked(true);
        await insertListenList(user.id, 'song', song);
      } else {
        setBookmarked(false);
        await deleteListenList(user.id, 'song', song);
      }
    } catch (error) {
      console.error(`Bookmark toggle failed: ${error}`);
      setBookmarked(!bookmark);
    }
  };

  const handleSessionButtonClick = async () => {
    if (!user || !song) return;

    try {
      const newRating = await upsertTrackRating({
        user_id: user.id,
        track_id: song.trackId,
        track_title: song.trackName,
        track_number: song.trackNumber,
        track_runtime: song.trackTimeMillis,
        album_id: song.collectionId,
        listened: false,
      });

      setSongRating(newRating);
      setListeningState(LISTENING_STATES.LISTENING);
    } catch (error) {
      console.error(`Failed to create journal entry: ${error}`);
      setError(error.message);
    }
  };

  const handleReviewSave = (updatedRating) => {
    setSongRating(updatedRating);
  };

  if (songLoading || listLoading || songRatingLoading) return <Loading />;
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
          <button className={styles.iconButton} onClick={handleBookmarkClick}>
            <img
              src={bookmarked ? bookmarkCheckFill : bookmark}
              alt="Bookmark song"
            />
          </button>

          {listeningState === LISTENING_STATES.UNPLAYED && (
            <button
              className={styles.primaryButton}
              onClick={handleSessionButtonClick}
            >
              Create journal entry
            </button>
          )}
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

      <div id="review-section" className={styles.reviewSection}>
        {listeningState !== LISTENING_STATES.UNPLAYED ? (
          <ReviewSection
            mediaRating={songRating}
            onSave={handleReviewSave}
            mediaType="song"
          />
        ) : (
          <div className={styles.emptyReview}>
            <p>No review yet. Create a journal entry to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Song;
