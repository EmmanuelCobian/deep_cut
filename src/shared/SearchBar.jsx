import { useState } from 'react';
import styles from './SearchBar.module.css';
import SearchIcon from '../assets/search.svg';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.searchWrapper}>
        <img className={styles.searchIcon} src={SearchIcon} />
        <input
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
};

export default SearchBar;
