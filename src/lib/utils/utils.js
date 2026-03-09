export function normalizeSong(song) {
  if (song.trackName) {
    return {
      id: song.trackId,
      title: song.trackName,
      artist: song.artistName,
      artwork: song.artworkUrl100,
      releaseDate: song.releaseDate,
    };
  } else if (song.media_type) {
    return {
      id: song.media_id,
      title: song.media_title,
      artist: song.artist_name,
      artwork: song.artwork_url,
      releaseDate: song.media_release_date,
    };
  }

  return {
    id: song.track_id,
    title: song.track_title,
    artist: song.artist_name,
    artwork: song.artwork_url,
    releaseDate: song.release_date,
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
  } else if (album.media_type) {
    return {
      id: album.media_id,
      title: album.media_title,
      artist: album.artist_name,
      artwork: album.artwork_url,
      releaseDate: album.media_release_date,
    };
  }
  return {
    id: album.album_id,
    title: album.album_title,
    artist: album.artist_name,
    artwork: album.artwork_url,
    releaseDate: album.release_date,
  };
}

export const normalizeEntry = (entry, type) => ({
  ...(type === 'album' ? normalizeAlbum(entry) : normalizeSong(entry)),
  type: type,
  original: entry,
});

export const applyFilters = (entries, { search, mediaFilter, sort }) => {
  let result = [...entries];

  if (mediaFilter !== 'all') {
    result = result.filter((e) =>
      mediaFilter === 'albums' ? e.type === 'album' : e.type === 'song'
    );
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.artist?.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    switch (sort) {
      case 'Oldest first': {
        return (
          new Date(a.original.updated_at ?? a.original.added_at) -
          new Date(b.original.updated_at ?? b.original.added_at)
        );
      }
      case 'Highest rated': {
        return (b.original.rating ?? -1) - (a.original.rating ?? -1);
      }
      case 'Lowest rated': {
        return (a.original.rating ?? -1) - (b.original.rating ?? -1);
      }
      case 'Newest first':
      default: {
        return (
          new Date(b.original.updated_at ?? b.original.added_at) -
          new Date(a.original.updated_at ?? a.original.added_at)
        );
      }
    }
  });

  return result;
};

export function meanOfTwoArrays(arr1, arr2) {
  const combined = [...arr1, ...arr2];
  if (combined.length === 0) return 0;

  const sum = combined.reduce((prev, cur) => prev + cur, 0);
  return Math.round((sum / combined.length) * 100) / 100;
}

export const sortByRecent = (entries) =>
  [...entries]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3);

export const msToHoursMinutes = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;
};

export const msToMinutesSeconds = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
