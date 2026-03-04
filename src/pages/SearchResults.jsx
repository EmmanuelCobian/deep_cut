import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchAlbums, fetchArtists, fetchSongs } from '../lib/api/itunes';
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';
import AlbumCard from '../shared/AlbumCard';
import ArtistCard from '../shared/ArtistCard';
import SongCard from '../shared/SongCard';
import { normalizeSong, normalizeAlbum } from '../lib/utils/utils';
import styles from './SearchResults.module.css';

function SearchResults() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.artistId}`);
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0) return;

      try {
        setIsLoading(true);

        const [albums, artists, songs] = await Promise.all([
          fetchAlbums(query),
          fetchArtists(query),
          fetchSongs(query),
        ]);

        setAlbums(albums);
        setArtists(artists);
        setSongs(songs);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch music: ${error}`);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getSearchResults();
  }, [query]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (artists.length == 0 && albums.length == 0 && songs.length == 0) {
    return (
      <div>
        <p>{`No results found for "${query}"`}</p>
        <p>Please try again with a different query</p>
      </div>
    );
  }

  return (
    <>
      {artists.length > 0 && <h2>Artists</h2>}
      <div className={styles.artistCardContainer}>
        {artists.map((artist) => (
          <div key={artist.artistId}>
            <ArtistCard
              artist={artist}
              onArtistClick={() => handleArtistClick(artist)}
            />
          </div>
        ))}
      </div>

      <h2>Songs</h2>
      <div className={styles.albumCardContainer}>
        {songs.map((song) => (
          <div key={song.trackId}>
            <SongCard
              song={normalizeSong(song)}
              onSongClick={() => handleSongClick(song.trackId)}
            />
          </div>
        ))}
      </div>

      <h2>Albums</h2>
      <div className={styles.albumCardContainer}>
        {albums.map((album) => (
          <div key={album.collectionId}>
            <AlbumCard
              album={normalizeAlbum(album)}
              onAlbumClick={() => handleAlbumClick(album.collectionId)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchResults;
