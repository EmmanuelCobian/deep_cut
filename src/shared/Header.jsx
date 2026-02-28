import SearchBar from './SearchBar';
import { useNavigate } from 'react-router';

function Header() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search/${query}`);
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <h1>Deep Cut</h1>
    </div>
  );
}

export default Header;
