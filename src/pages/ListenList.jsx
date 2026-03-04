import { useState, useEffect } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { useNavigate } from 'react-router';
import Loading from '../shared/Loading';
import ErrorMessage from '../shared/ErrorMessage';
import SongCard from '../shared/SongCard';
import AlbumCard from '../shared/AlbumCard';
import { fetchListenList } from '../lib/utils/supabase';
import { normalizeSong, normalizeAlbum } from '../lib/utils/utils';
import styles from './ListenList.module.css';

function ListenList() {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  useEffect(() => {
    const getListeningList = async () => {
      if (!user || userLoading) return;

      try {
        setListLoading(true);
        const list = await fetchListenList(user.id);
        setSongs(list.filter((media) => media.media_type === 'song'));
        setAlbums(list.filter((media) => media.media_type === 'album'));
        setListLoading(false);
      } catch (error) {
        console.error(`Failed to fetch listening list: ${error}`);
        setError(error.message);
        setListLoading(false);
      }
    };

    getListeningList();
  }, [user, userLoading]);

  if (listLoading || userLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <div>
        <h2>Songs</h2>
        <div className={styles.cardContainer}>
          {songs.map((song) => (
            <SongCard
              song={normalizeSong(song)}
              onSongClick={() => handleSongClick(song.media_id)}
            />
          ))}
        </div>
      </div>
      <div>
        <h2>Albums</h2>
        <div className={styles.cardContainer}>
          {albums.map((album) => (
            <AlbumCard
              album={normalizeAlbum(album)}
              onAlbumClick={() => handleAlbumClick(album.media_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListenList;
