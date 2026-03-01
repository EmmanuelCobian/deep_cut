import styles from './AlbumCard.module.css';

function AlbumCard({ album }) {
  return (
    <div>
      <img
        src={album.artworkUrl100}
        alt={`Cover art for ${album.collectionName}`}
      />
      <p>{album.artistName}</p>
      <p>{album.collectionName}</p>
      <hr />
    </div>
  );
}

export default AlbumCard;
