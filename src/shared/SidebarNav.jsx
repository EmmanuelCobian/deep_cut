import { Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import styles from './SidebarNav.module.css';

function SidebarNav() {
  const { user, signOut } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          Deep Cut
        </div>

        <nav className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/lists">Listen List</Link>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        {user ? (
          <button onClick={signOut}>Log out</button>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </div>
    </aside>
  );
}

export default SidebarNav;