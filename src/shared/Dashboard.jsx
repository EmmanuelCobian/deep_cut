import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import supabase from '../lib/utils/supabase';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import StatCard from './StatCard';
import styles from './Dashboard.module.css';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);

        const { data: entries, error: entriesError } = await supabase
          .from('album_ratings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('listened_at', { ascending: false })
          .limit(8);

        if (entriesError) throw entriesError;

        setRecentEntries(entries);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [user.id]);

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
        <StatCard label="Albums rated" value={stats?.totalAlbums || '-'} />
        <StatCard label="Tracks rated" value={stats?.totalTracks || '-'} />
        <StatCard
          label="Avg album rating"
          value={stats?.avgRating ? `${stats.avgRating} / 10` : '-'}
        />
      </div>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent entries</h2>
          <Link to="/journal" className={styles.seeAll}>
            See all
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No entries yet</p>
          </div>
        ) : (
          <div className={styles.albumGrid}>
            <p>entrires here</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
