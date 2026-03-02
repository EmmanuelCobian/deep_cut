import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { fetchAlbum } from '../lib/api/itunes';

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
    return `${hours > 0 ? `${hours} hr` : ''} ${minutes} min`;
  };

  const msToMinutesSeconds = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
  };

  const getYear = (date) => {
    return date.split('-')[0];
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
        setAlbum({ ...header, runtime: getAlbumRuntime(rest) });
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

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to={'/'}>Go back home</Link>
      </div>
    );
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
          <p>{getYear(album.releaseDate)}</p>
          <p>{album.trackCount} songs</p>
          <p>{album.runtime}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, idx) => (
            <tr key={song.trackId}>
              <td>{idx + 1}</td>
              <td>
                <p>{song.trackName}</p>
                <div>
                  <p>
                    <span>
                      {song.contentAdvisoryRating === 'Explicit' && 'E'}
                    </span>{' '}
                    {song.artistName}
                  </p>
                </div>
              </td>
              <td>{msToMinutesSeconds(song.trackTimeMillis)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Album;
