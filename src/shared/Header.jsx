import SearchBar from './SearchBar';

function Header({ onSearch }) {
  return (
    <div>
      <SearchBar onSearch={onSearch} />
      <h1>Deep Cut</h1>
    </div>
  );
}

export default Header;
