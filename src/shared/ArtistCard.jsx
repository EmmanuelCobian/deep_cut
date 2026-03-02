import styles from './ArtistCard.module.css';
import profilePic from '../assets/default_artist_pic.webp';

function ArtistCard({ artist, onArtistClick }) {
  const imageSrc = artist.artwork || profilePic;

  return (
    <div className={styles.card} onClick={onArtistClick}>
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={`Artwork for ${artist.artistName}`}
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <p className={styles.name}>{artist.artistName}</p>
        <p className={styles.type}>Artist</p>
      </div>
    </div>
  );
}

export default ArtistCard;