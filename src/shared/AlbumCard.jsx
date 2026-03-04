import styles from './AlbumCard.module.css';

function AlbumCard({ album, onAlbumClick }) {
  const releaseYear = album.releaseDate.split('-')[0];

  return (
    <div className={styles.card} onClick={onAlbumClick}>
      <div className={styles.imageWrapper}>
        <img
          src={album.artwork.replace('100x100', '600x600')}
          alt={`Cover art for ${album.title}`}
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <p className={styles.title}>{album.title}</p>
        <p className={styles.meta}>
          {releaseYear} • {album.artist}
        </p>
      </div>
    </div>
  );
}

export default AlbumCard;
