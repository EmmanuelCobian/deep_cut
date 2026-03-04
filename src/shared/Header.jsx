import SearchBar from './SearchBar';
import { useNavigate, useLocation, NavLink, Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import styles from './Header.module.css';
import ArrowLeftIcon from '../assets/arrow-left.svg';

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
          <img src={ArrowLeftIcon} />
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
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Home
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Journal
          </NavLink>
          <NavLink
            to="/lists"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Listen List
          </NavLink>
        </div>

        <div className={styles.authSection}>
          {user ? (
            <button onClick={signOut} className={styles.authButton}>
              Log out
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className={styles.authButton}>
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
