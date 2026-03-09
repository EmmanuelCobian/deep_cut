import { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import { fetchAlbum } from '../lib/api/itunes';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import SessionModal from '../features/SessionModal'
import ReviewSection from '../shared/ReviewSection';
import {
  deleteListenList,
  fetchListenList,
  insertListenList,
  fetchAlbumRating,
  fetchTrackRatings,
} from '../lib/utils/supabase';
import { msToHoursMinutes, msToMinutesSeconds } from '../lib/utils/utils';
import bookmark from '../assets/bookmark.svg';
import bookmarkCheckFill from '../assets/bookmark-check-fill.svg';
import arrowUpRight from '../assets/arrow-up-right.svg';
import styles from './Album.module.css';

const LISTENING_STATES = {
  UNPLAYED: 'Unplayed',
  LISTENING: 'Listening',
  LISTENED: 'Listened',
};

function Album() {
  const { albumId } = useParams();
  const { user, loading: userLoading } = useAuth();

  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albumRating, setAlbumRating] = useState(null);
  const [trackRatings, setTrackRatings] = useState([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [listeningState, setListeningState] = useState(
    LISTENING_STATES.UNPLAYED
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [albumLoading, setAlbumLoading] = useState(true);
  const [albumRatingLoading, setAlbumRatingLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getYear = (date) => {
    return date.split('-')[0];
  };

  const getAlbumRuntime = (songs) => {
    const total = songs.reduce((acc, song) => acc + song.trackTimeMillis, 0);
    return msToHoursMinutes(total);
  };

  const getRatingForTrack = useCallback(
    (trackId) =>
      trackRatings.find((rating) => rating.track_id === String(trackId)) ??
      null,
    [trackRatings]
  );

  useEffect(() => {
    const getAlbum = async () => {
      try {
        setAlbumLoading(true);

        const res = await fetchAlbum(albumId);
        const [header, ...rest] = res.results;

        setAlbum({ ...header, runtime: getAlbumRuntime(rest) });
        setSongs(rest);
      } catch (error) {
        console.error(`Failed to fetch album: ${error}`);
        setError(error.message);
      } finally {
        setAlbumLoading(false);
      }
    };

    getAlbum();
  }, [albumId]);

  useEffect(() => {
    const getListenList = async () => {
      if (userLoading || !user?.id) return;

      try {
        setListLoading(true);

        const listenList = await fetchListenList(user.id);
        const isBookmarked = listenList.some(
          (item) => item.media_id === albumId
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
  }, [user?.id, userLoading, albumId]);

  useEffect(() => {
    const getRatings = async () => {
      if (userLoading || !user?.id || !album) return;

      try {
        setAlbumRatingLoading(true);

        const rating = await fetchAlbumRating(user.id, album.collectionId);
        const tracks = await fetchTrackRatings(user.id, album.collectionId);

        setAlbumRating(rating);
        setTrackRatings(tracks);

        if (rating?.status === 'completed') {
          setListeningState(LISTENING_STATES.LISTENED);
        } else if (rating?.status === 'in_progress') {
          setListeningState(LISTENING_STATES.LISTENING);
        } else {
          setListeningState(LISTENING_STATES.UNPLAYED);
        }
      } catch (error) {
        console.error(`Failed to fetch album rating: ${error}`);
        setError(error.message);
      } finally {
        setAlbumRatingLoading(false);
      }
    };

    getRatings();
  }, [user?.id, userLoading, album?.collectionId]);

  const handleReviewSave = (updatedRating) => {
    setAlbumRating(updatedRating);
    setListeningState(LISTENING_STATES.LISTENED);
  };

  const handleSessionUpdate = (updatedRating, updatedTracks) => {
    setAlbumRating(updatedRating);
    setTrackRatings(updatedTracks);
    if (updatedRating?.status === 'in_progress') {
      setListeningState(LISTENING_STATES.LISTENING);
    }
  };

  const handleBookmarkClick = async () => {
    if (!user) return;

    try {
      if (!bookmarked) {
        setBookmarked(true);
        await insertListenList(user.id, 'album', album);
      } else {
        setBookmarked(false);
        await deleteListenList(user.id, 'album', album);
      }
    } catch (error) {
      console.error(`Bookmark toggle failed: ${error}`);
      setBookmarked((prev) => !prev);
    }
  };

  const handleSessionButtonClick = () => {
    setModalOpen(true);
  };

  const sessionButtonLabel = () => {
    if (listeningState === LISTENING_STATES.UNPLAYED)
      return 'Create journal entry';
    if (listeningState === LISTENING_STATES.LISTENING)
      return 'Continue rating tracks';
    return 'Edit track ratings';
  };

  if (albumLoading || listLoading || albumRatingLoading) return <Loading />;

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
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
            <Link to={`/artist/${album.artistId}`}>{album.artistName}</Link> •{' '}
            {getYear(album.releaseDate)} • {album.trackCount} songs •{' '}
            {album.runtime}
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

          <button
            className={styles.primaryButton}
            onClick={handleSessionButtonClick}
          >
            {sessionButtonLabel()}
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
          <span>Rating</span>
          <span>Duration</span>
        </div>

        {songs.map((song, idx) => {
          const trackRating = getRatingForTrack(song.trackId);

          return (
            <div key={song.trackId} className={styles.trackRow}>
              <span className={styles.trackNumber}>{idx + 1}</span>

              <div className={styles.trackInfo}>
                <p
                  className={styles.trackName}
                  onClick={() => navigate(`/song/${song.trackId}`)}
                >
                  {song.trackName}
                </p>
                <p className={styles.trackArtist}>
                  {song.contentAdvisoryRating === 'Explicit' && (
                    <span className={styles.explicit}>E</span>
                  )}
                  {song.artistName}
                </p>
              </div>

              <span className={styles.trackRating}>
                {trackRating?.rating ?? '-'}
              </span>

              <span className={styles.duration}>
                {msToMinutesSeconds(song.trackTimeMillis)}
              </span>

              <Link to={`/song/${song.trackId}`} className={styles.trackLink}>
                <img src={arrowUpRight} alt="" />
              </Link>
            </div>
          );
        })}
      </div>

      <div className={styles.reviewSection}>
        {listeningState !== LISTENING_STATES.UNPLAYED ? (
          <ReviewSection mediaRating={albumRating} onSave={handleReviewSave} />
        ) : (
          <div className={styles.emptyReview}>
            <p>No review yet. Create a journal entry to begin.</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <SessionModal
          album={album}
          songs={songs}
          existingEntry={albumRating}
          existingTrackRatings={trackRatings}
          userId={user.id}
          onClose={() => setModalOpen(false)}
          onSessionUpdate={handleSessionUpdate}
        />
      )}
    </>
  );
}

export default Album;
