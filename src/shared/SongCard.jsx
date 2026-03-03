import styles from './SongCard.module.css';

function SongCard({ song, onSongClick }) {
  return (
    <div className={styles.card} onClick={onSongClick}>
      <div className={styles.imageWrapper}>
        <img
          src={song.artworkUrl100.replace('100x100', '600x600')}
          alt={`Cover art for ${song.trackName}`}
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <p className={styles.title}>{song.trackName}</p>
        <p className={styles.meta}>
          Song • {song.artistName}
        </p>
      </div>
    </div>
  );
}

export default SongCard;
