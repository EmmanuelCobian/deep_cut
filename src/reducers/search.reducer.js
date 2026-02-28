const actions = {
  fetchDiscography: 'fetchDiscography',
  fetchDiscographySuccess: 'fetchDiscographySuccess',
  fetchDiscographyFailure: 'fetchDiscographyFailure',

  fetchAlbums: 'fetchAlbums',
  fetchAlbumsSuccess: 'fetchAlbumsSuccess',
  fetchAlbumsFailure: 'fetchAlbumsFailure',

  fetchArtists: 'fetchArtists',
  fetchArtistsSuccess: 'fetchArtistsSuccess',
  fetchArtistsFailure: 'fetchArtistsFailure',

  fetchSearchResults: 'fetchSearchResults',
  fetchSearchResultsSuccess: 'fetchSearchResultsSuccess',
  fetchSearchResultsFailure: 'fetchSearchResultsFailure',

  changeSearchQuery: 'changeSearchQuery',
  changeArtistId: 'changeArtistId',
  changeAlbumId: 'changeAlbumId',

  clearError: 'clearError',
};

const initialState = {
  searchQuery: '',
  artistDiscography: [],
  artists: [],
  albums: [],
  selectedArtistId: -1,
  selectedAlbumId: -1,
  isLoading: false,
  error: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetchSearchResults:
    case actions.fetchAlbums:
    case actions.fetchArtists:
    case actions.fetchDiscography: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case actions.fetchSearchResultsFailure:
    case actions.fetchAlbumsFailure:
    case actions.fetchArtistsFailure:
    case actions.fetchDiscographyFailure: {
      return {
        ...state,
        isLoading: false,
        error: action.error.message,
      };
    }

    case actions.fetchDiscographySuccess: {
      return {
        ...state,
        isLoading: false,
        artistDiscography: action.discography,
      };
    }

    case actions.fetchAlbumsSuccess: {
      return {
        ...state,
        isLoading: false,
        albums: action.albums,
      };
    }

    case actions.fetchArtistsSuccess: {
      return {
        ...state,
        isLoading: false,
        artists: action.artists,
      };
    }

    case actions.fetchSearchResultsSuccess: {
      return {
        ...state,
        isLoading: false,
        artists: action.artists,
        albums: action.albums,
      };
    }

    case actions.changeSearchQuery: {
      return {
        ...state,
        searchQuery: action.searchQuery,
      };
    }

    case actions.changeArtistId: {
      return {
        ...state,
        selectedArtistId: action.selectedArtistId,
      };
    }

    case actions.changeAlbumId: {
      return {
        ...state,
        selectedAlbumId: action.selectedAlbumId,
      };
    }

    case actions.clearError: {
      return {
        ...state,
        error: '',
      };
    }

    default:
      return state;
  }
};

export { initialState, actions, reducer };
