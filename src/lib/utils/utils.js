export function normalizeSong(song) {
  if (song.trackName) {
    return {
      id: song.trackId,
      title: song.trackName,
      artist: song.artistName,
      artwork: song.artworkUrl100,
      releaseDate: song.releaseDate,
    };
}

return {
    id: song.media_id,
    title: song.media_title,
    artist: song.artist_name,
    artwork: song.artwork_url,
    releaseDate: song.media_release_date,
  };
}

export function normalizeAlbum(album) {
  if (album.collectionId) {
    return {
      id: album.collectionId,
      title: album.collectionName,
      artist: album.artistName,
      artwork: album.artworkUrl100,
      releaseDate: album.releaseDate,
    };
}

return {
    id: album.media_id,
    title: album.media_title,
    artist: album.artist_name,
    artwork: album.artwork_url,
    releaseDate: album.media_release_date,
  };
}
