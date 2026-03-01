import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router';
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <div className={styles.header}>
      <h1>Deep Cut</h1>
      <button onClick={() => navigate(-1)} disabled={isHome}>
        &lt;
      </button>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default Header;
