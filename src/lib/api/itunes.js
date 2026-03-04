const ITUNES_BASE_URL = 'https://itunes.apple.com';

/**
 * Fetches a url and returns the JSON response
 *
 * @param {string} url - the url string to fetch
 * @returns JSON object with the result of the fetch
 */
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

/**
 * Get album metadata from a user's search query
 *
 * @param {string} searchQuery = the user's search query
 * @returns List of objects where each element is the metadata for an album
 */
export async function fetchAlbums(searchQuery) {
  const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=album&limit=15`;
  const res = await fetchJSON(url);
  return res.results;
}

/**
 * Get song metadata from a user's search query
 * 
 * @param {StorageManager} searchQuery - the uer's search query
 * @returns List of objects where each element is the metadata for a song
 */
export async function fetchSongs(searchQuery) {
  const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=song&limit=15`;
  const res = await fetchJSON(url);
  return res.results;
}

/**
 * Get artist metadata, including the cover art for one of their albums (if applicable), from a user's search query
 *
 * @param {string} searchQuery - the user's search query
 * @returns List of objects where each element has metadata on an artist
 */
export async function fetchArtists(searchQuery) {
  const searchUrl = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=musicArtist&limit=3`;

  const searchData = await fetchJSON(searchUrl);
  const artists = searchData.results;

  if (!artists.length) return [];

  const artistIds = artists.map((artist) => artist.artistId).join(',');

  const lookupUrl = `${ITUNES_BASE_URL}/lookup?id=${artistIds}&entity=album&limit=1`;
  const lookupData = await fetchJSON(lookupUrl);

  const firstAlbumByArtist = {};
  for (const item of lookupData.results) {
    if (item.wrapperType === 'collection') {
      if (!firstAlbumByArtist[item.artistId]) {
        firstAlbumByArtist[item.artistId] = item;
      }
    }
  }

  return artists.map((artist) => {
    const album = firstAlbumByArtist[artist.artistId];

    return {
      ...artist,
      artwork: album?.artworkUrl100?.replace('100x100', '400x400'),
    };
  });
}

/**
 * Get artist metadata from an artistId
 *
 * @param {number} artistId - the id for an artist on the iTunes db
 * @returns Object with artist metadata
 */
export async function fetchArtistDiscography(artistId) {
  const url = `${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=album&limit=200`;
  return fetchJSON(url);
}

/**
 * Get details for an album / collection of music
 *
 * @param {number} albumId - The unique ID for the work of music
 * @returns Object with the album metadata
 */
export async function fetchAlbum(albumId) {
  const url = `${ITUNES_BASE_URL}/lookup?id=${albumId}&entity=song`;
  return fetchJSON(url);
}

export async function fetchSong(songId) {
  const url = `${ITUNES_BASE_URL}/lookup?id=${songId}&entity=song`;
  return fetchJSON(url);
}
