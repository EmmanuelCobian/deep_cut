import { useState } from 'react';
import {
  createAlbumSession,
  linkStandaloneRatings,
  upsertTrackRating,
  fetchTrackRatings,
} from '../lib/utils/supabase';
import styles from './SessionModal.module.css';

function SessionModal({
  album,
  songs,
  existingEntry,
  existingTrackRatings,
  userId,
  onClose,
  onSessionUpdate,
}) {
  const [entry, setEntry] = useState(existingEntry);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [trackStates, setTrackStates] = useState(() =>
    songs.map((song) => {
      const existing = existingTrackRatings.find(
        (r) => r.track_id === String(song.trackId)
      );

      return {
        id: existing?.id ?? null,
        track_id: String(song.trackId),
        track_title: song.trackName,
        track_number: song.trackNumber ?? null,
        track_runtime: song.trackTimeMillis ?? null,
        listened: existing?.listened ?? false,
        rating: existing?.rating ?? '',
        release_date: song.releaseDate,
        artist_name: song.artistName,
        artwork_url: song.artworkUrl100,
      };
    })
  );

  const listenedCount = trackStates.filter((t) => t.listened).length;

  const ensureSession = async () => {
    if (entry) return entry;

    const newEntry = await createAlbumSession(userId, album);
    await linkStandaloneRatings(newEntry.id, album.collectionId, userId);

    setEntry(newEntry);
    return newEntry;
  };

  const handleListenedToggle = (trackId) => {
    setTrackStates((prev) =>
      prev.map((t) =>
        t.track_id === trackId
          ? { ...t, listened: !t.listened, rating: !t.listened ? t.rating : '' }
          : t
      )
    );
  };

  const handleRatingChange = (trackId, value) => {
    if (
      value !== '' &&
      (isNaN(value) || Number(value) < 0 || Number(value) > 10)
    )
      return;

    setTrackStates((prev) =>
      prev.map((t) => (t.track_id === trackId ? { ...t, rating: value } : t))
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const currentEntry = await ensureSession();

      await Promise.all(
        trackStates.map((t) =>
          upsertTrackRating({
            ...t,
            id: t.id ?? undefined,
            entry_id: currentEntry.id,
            user_id: userId,
            album_id: album.collectionId,
            rating: t.rating !== '' ? Number(t.rating) : null,
          })
        )
      );

      const updatedTracks = await fetchTrackRatings(userId, album.collectionId);
      onSessionUpdate(currentEntry, updatedTracks);
      onClose();
    } catch (err) {
      console.error('Failed to save session:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.albumInfo}>
            <img
              className={styles.artwork}
              src={album.artworkUrl100.replace('100x100', '300x300')}
              alt={`Cover art for ${album.collectionName}`}
            />
            <div>
              <p className={styles.albumTitle}>{album.collectionName}</p>
              <p className={styles.artistName}>{album.artistName}</p>
              <p className={styles.progress}>
                {listenedCount} / {songs.length} tracks listened
              </p>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.trackList}>
          {trackStates.map((track) => (
            <div
              key={track.track_id}
              className={`${styles.trackRow} ${track.listened ? styles.listened : ''}`}
            >
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={track.listened}
                  onChange={() => handleListenedToggle(track.track_id)}
                />
              </label>

              <span className={styles.trackTitle}>{track.track_title}</span>

              <div className={styles.ratingWrap}>
                <input
                  type="number"
                  className={styles.ratingInput}
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="_._"
                  value={track.rating}
                  disabled={!track.listened}
                  onChange={(e) =>
                    handleRatingChange(track.track_id, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save progress'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionModal;
