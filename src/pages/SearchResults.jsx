import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchAlbums, fetchArtists } from '../api/itunes';
import { actions as searchActions } from '../reducers/search.reducer';

function SearchResults({ searchState, dispatch }) {
  const { query } = useParams();
  const navigate = useNavigate();

  const handleArtistClick = (event, artist) => {
    event.preventDefault();
    navigate(`/artist/${artist.artistId}`)
  };

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query || query.length === 0) return;

      try {
        dispatch({ type: searchActions.fetchSearchResults });
        const [albums, artists] = await Promise.all([
          fetchAlbums(query),
          fetchArtists(query),
        ]);
        dispatch({
          type: searchActions.fetchSearchResultsSuccess,
          albums: albums,
          artists: artists,
        });
      } catch (error) {
        console.error(`Failed to fetch music: ${error}`);
        dispatch({
          type: searchActions.fetchSearchResultsFailure,
          error: error,
        });
      }
    };

    getSearchResults();
  }, [query]);

  if (searchState.isLoading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div>
        {searchState.artists.map((artist) => (
          <div
            key={artist.artistId}
            onClick={(e) => handleArtistClick(e, artist)}
          >
            <p>{artist.artistName}</p>
            {artist.artwork && (
              <img
                src={artist.artwork}
                alt={`Artwork for ${artist.artistName}`}
              />
            )}
            <hr />
          </div>
        ))}
      </div>

      <hr />

      <div>
        {searchState.albums.map((album) => (
          <div key={album.collectionId}>
            <p>{album.artistName}</p>
            <p>{album.collectionName}</p>
            <img
              src={album.artworkUrl100}
              alt={`Cover art for ${album.collectionName}`}
            />
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchResults;
