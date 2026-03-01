import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHome = location.pathname === '/';

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <div className={styles.header}>
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        disabled={isHome}
      >
        ←
      </button>
      <div className={styles.searchWrapper}>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
}

export default Header;
