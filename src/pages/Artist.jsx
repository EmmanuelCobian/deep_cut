import { useEffect } from 'react';
import { useParams } from 'react-router';
import { fetchArtistDiscography } from '../api/itunes';

function Artist({ searchState }) {
  const { artistId } = useParams();

  useEffect(() => {
    const getDiscography = async () => {
      try {
        dispatch({ type: searchActions.fetchDiscography });
        const discography = await fetchArtistDiscography(artistId);
        dispatch({
          type: searchActions.fetchDiscographySuccess,
          discography: discography.results,
        });
      } catch (error) {
        console.error(`Failed to fetch discography: ${error}`);
        dispatch({ type: searchActions.fetchDiscographyFailure, error: error });
      }
    };

    getDiscography();
  }, [artistId]);

  if (searchState.isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <h1>{searchState.artistDiscography[0].artistName}</h1>
      {searchState.artistDiscography.slice(1).map((album) => (
        <div key={album.collectionId}>
          <p>{album.collectionName}</p>
          <img
            src={album.artworkUrl100}
            alt={`Cover art for ${album.collectionName}`}
          />
        </div>
      ))}
    </div>
  );
}

export default Artist;
