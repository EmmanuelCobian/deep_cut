import styles from './ArtistCard.module.css';
import profilePic from '../assets/default_artist_pic.webp';

function ArtistCard({ artist }) {
  return (
    <div className={styles.cardContainer}>
      {artist.artwork ? (
        <img src={artist.artwork} alt={`Artwork for ${artist.artistName}`} />
      ) : (
        <img src={profilePic} alt="Default profile picture" />
      )}
      <p>{artist.artistName}</p>
      <p>Artist</p>
    </div>
  );
}

export default ArtistCard;
