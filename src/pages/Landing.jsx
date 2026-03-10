import { useAuth } from '../lib/context/AuthContext';
import Loading from '../shared/Loading';
import Hero from '../features/Hero';
import Dashboard from '../features/Dashboard/Dashboard';
import styles from './Landing.module.css';

function Landing() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <div className={styles.page}>
      {user ? <Dashboard user={user} /> : <Hero />}
    </div>
  );
}

export default Landing;