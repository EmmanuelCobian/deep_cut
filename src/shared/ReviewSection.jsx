import { useState } from 'react';
import { updateAlbumRating, updateTrackRating } from '../lib/utils/supabase';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ReviewSection.module.css';

function ReviewSection({ mediaRating, onSave, mediaType = 'album' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(mediaRating?.rating ?? '');
  const [thoughts, setThoughts] = useState(mediaRating?.thoughts ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleRatingChange = (value) => {
    if (
      value !== '' &&
      (isNaN(value) || Number(value) < 0 || Number(value) > 10)
    )
      return;
    setRating(value);
    setIsDirty(true);
  };

  const handleThoughtsChange = (value) => {
    setThoughts(value);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      let updated;
      if (mediaType === 'album') {
        updated = await updateAlbumRating(mediaRating.id, {
          rating: rating !== '' ? Number(rating) : null,
          thoughts: thoughts || null,
        });
      } else if (mediaType === 'song') {
        updated = await updateTrackRating(mediaRating.id, {
          rating: rating !== '' ? Number(rating) : null,
          thoughts: thoughts || null,
        })
      }

      setIsDirty(false);
      setIsEditing(false);
      onSave(updated);
    } catch (err) {
      console.error('Failed to save review:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setRating(mediaRating?.rating ?? '');
    setThoughts(mediaRating?.thoughts ?? '');
    setIsDirty(false);
    setError('');
    setIsEditing(false);
  };

  return (
    <div className={styles.reviewSection}>
      <div className={styles.reviewHeader}>
        <h2 className={styles.reviewTitle}>Your review</h2>
        {!isEditing && (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className={styles.reviewBody}>
        {isEditing ? (
          <>
            <div className={styles.reviewRatingRow}>
              <label className={styles.reviewLabel} htmlFor="media-rating">
                Overall rating
              </label>
              <div className={styles.ratingInputWrap}>
                <input
                  id="media-rating"
                  type="number"
                  className={styles.ratingInput}
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="—"
                  value={rating}
                  onChange={(e) => handleRatingChange(e.target.value)}
                />
                <span className={styles.ratingDenominator}>/10</span>
              </div>
            </div>

            <div className={styles.reviewThoughtsRow}>
              <label className={styles.reviewLabel} htmlFor="media-thoughts">
                Thoughts
                <span className={styles.markdownHint}>Markdown supported</span>
              </label>
              <textarea
                id="media-thoughts"
                className={styles.reviewTextarea}
                placeholder="Write down your thoughts here"
                value={thoughts}
                rows={8}
                onChange={(e) => handleThoughtsChange(e.target.value)}
              />
            </div>

            {error && <p className={styles.reviewError}>{error}</p>}

            <div className={styles.reviewFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!isDirty || saving}
              >
                {saving ? 'Saving…' : 'Save review'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className={styles.reviewLabel}>Rating</p>
              <p className={styles.reviewRatingDisplay}>
                <span className={styles.ratingValue}>
                  {rating ? rating : '-'}
                </span>
                <span>/ 10</span>
              </p>
            </div>

            <div>
              <p className={styles.reviewLabel}>Thoughts</p>
              {thoughts ? (
                <Markdown remarkPlugins={[remarkGfm]}>{thoughts}</Markdown>
              ) : (
                <p className={styles.reviewEmptyThoughts}>
                  No thoughts yet.{' '}
                  <button
                    className={styles.nudgeButton}
                    onClick={() => setIsEditing(true)}
                  >
                    Write something?
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
