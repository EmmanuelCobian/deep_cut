import SearchBar from './SearchBar';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import styles from './Header.module.css';

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <nav className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          disabled={isHome}
        >
          ←
        </button>

        <Link to="/" replace className={styles.logo}>
          Deep Cut
        </Link>
      </div>

      <div className={styles.middleSection}>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className={styles.rightSection}>
        <div className={styles.navLinks}>
          <Link to="/">Home</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/lists">Listen List</Link>
        </div>

        <div className={styles.authSection}>
          {user ? (
            <button onClick={signOut} className={styles.authButton}>
              Log out
            </button>
          ) : (
            <Link to="/login" className={styles.authButton}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
