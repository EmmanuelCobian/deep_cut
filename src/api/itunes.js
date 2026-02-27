const ITUNES_BASE_URL = 'https://itunes.apple.com';

async function fetchJSON(url) {
const response = await fetch(url);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function fetchAlbums(searchQuery) {
  const url = `${ITUNES_BASE_URL}/search?term=${encodeURIComponent(searchQuery)}&media=music&entity=album&limit=100`;
  const res = await fetchJSON(url);
  return res.results;
}

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
      artwork: album?.artworkUrl100?.replace('100x100', '300x300'),
    };
  });
}

export async function fetchArtistDiscography(artistId) {
  const url = `${ITUNES_BASE_URL}/lookup?id=${artistId}&entity=album&limit=200`;
  return fetchJSON(url);
}