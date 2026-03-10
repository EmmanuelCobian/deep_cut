import styles from './SongCard.module.css';

function SongCard({ song, onSongClick }) {
  const releaseYear = song.releaseDate.split('-')[0] ?? 'Unkonwn';

  return (
    <div className={styles.card} onClick={onSongClick}>
      <div className={styles.imageWrapper}>
        <img
          src={song.artwork.replace('100x100', '600x600')}
          alt={`Cover art for ${song.title}`}
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <p className={styles.title}>{song.title}</p>
        <p className={styles.meta}>
          {releaseYear} • {song.artist}
        </p>
      </div>
    </div>
  );
}

export default SongCard;
