import SearchBar from './SearchBar';
import { useNavigate, useLocation } from 'react-router';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} disabled={isHome}>
        &lt;
      </button>
      <SearchBar onSearch={handleSearch} />
      <h1>Deep Cut</h1>
    </div>
  );
}

export default Header;
