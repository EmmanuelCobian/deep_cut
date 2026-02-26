import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(query)
    setQuery('')
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button disabled={query.trim().length == 0} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
