import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchAlbum } from '../api/itunes';

function Album() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const msToHoursMinutes = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const getAlbumRuntime = (songs) => {
    let milliseconds = 0;
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      milliseconds += song.trackTimeMillis;
    }
    return msToHoursMinutes(milliseconds);
  };

  useEffect(() => {
    const getAlbum = async () => {
      try {
        setIsLoading(true);
        const res = await fetchAlbum(albumId);
        const [header, ...rest] = res.results;
        const { hours, minutes } = getAlbumRuntime(rest);
        setAlbum({ ...header, hours: hours, minutes: minutes });
        setSongs(rest);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to fetch discography: ${error}`);
        setError(error.message);
        setIsLoading(false);
      }
    };

    getAlbum();
  }, [albumId]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div>
        <img
          src={album.artworkUrl100}
          alt={`Cover art for ${album.collectionName}`}
        />
        <p>Album</p>
        <p>{album.collectionName}</p>

        <div>
          <p>{album.artistName}</p>
          <p>{album.releaseDate}</p>
          <p>{album.trackCount} songs</p>
          <p>
            {album.hours > 0 && `${album.hours} hr`} {album.minutes} min
          </p>
        </div>
      </div>
    </>
  );
}

export default Album;
