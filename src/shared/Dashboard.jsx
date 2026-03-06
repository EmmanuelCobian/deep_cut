import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  fetchAllAlbumRatings,
  fetchAllTrackRatings,
} from '../lib/utils/supabase';
import {
  normalizeAlbum,
  normalizeSong,
  meanOfTwoArrays,
  sortByRecent,
} from '../lib/utils/utils';
import AlbumCard from './AlbumCard';
import SongCard from './SongCard';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import StatCard from './StatCard';
import styles from './Dashboard.module.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [recentAlbumEntries, setRecentAlbumEntries] = useState([]);
  const [recentSongEntries, setRecentSongEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);

        const [albumEntries, trackEntries] = await Promise.all([
          fetchAllAlbumRatings(user.id),
          fetchAllTrackRatings(user.id),
        ]);

        const albumRatings = albumEntries
          .filter((entry) => Number.isFinite(entry.rating))
          .map((entry) => entry.rating);
        const trackRatings = trackEntries
          .filter((entry) => Number.isFinite(entry.rating))
          .map((entry) => entry.rating);

        let averageRating = 0;
        if (albumRatings.length > 0 || trackRatings.length > 0) {
          averageRating = meanOfTwoArrays(albumRatings, trackRatings);
        }

        setStats({
          albumsRated: albumRatings.length,
          tracksRated: trackRatings.length,
          averageRating: averageRating,
        });

        setRecentAlbumEntries(sortByRecent(albumEntries));
        setRecentSongEntries(sortByRecent(trackEntries));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [user.id]);

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleSongClick = (songId) => {
    navigate(`/song/${songId}`);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  const firstName = user.email.split('@')[0];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <p className={styles.greeting}>Welcome back</p>
          <h1 className={styles.dashboardTitle}>{firstName}</h1>
        </div>
      </div>

      <div className={styles.statsRow}>
        <StatCard label="Albums rated" value={stats?.albumsRated || '-'} />
        <StatCard label="Tracks rated" value={stats?.tracksRated || '-'} />
        <StatCard
          label="Avg rating"
          value={stats?.averageRating ? `${stats.averageRating} / 10` : '-'}
        />
      </div>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent album entries</h2>
          <Link to="/journal" className={styles.seeAll}>
            See all
          </Link>
        </div>

        {recentAlbumEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No entries yet</p>
          </div>
        ) : (
          <div className={styles.albumGrid}>
            {recentAlbumEntries.map((album) => (
              <AlbumCard
                key={album.id}
                album={normalizeAlbum(album)}
                onAlbumClick={() => handleAlbumClick(album.album_id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent song entries</h2>
          <Link to="/journal" className={styles.seeAll}>
            See all
          </Link>
        </div>

        {recentSongEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No entries yet</p>
          </div>
        ) : (
          <div className={styles.albumGrid}>
            {recentSongEntries.map((song) => (
              <SongCard
                key={song.id}
                song={normalizeSong(song)}
                onSongClick={() => handleSongClick(song.track_id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
