import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Insert or update a track rating row.
 * If data.id is provided, updates that row. Otherwise inserts a new one.
 *
 * @param {Object} data - track rating fields
 * @returns the upserted row
 */
export const upsertTrackRating = async (data) => {
  const { data: result, error } = await supabase
    .from('track_ratings')
    .upsert(data, { onConflict: 'user_id,track_id' })
    .select()
    .single();

  if (error) throw error;
  return result;
};

/**
 * Updates overall rating and thoughts on a track rating
 *
 * @param {string} entryId - the track_ratings row id
 * @param {{ rating?: number, thoughts?: string }} updates
 * @returns the updated track_ratings row
 */
export const updateTrackRating = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('track_ratings')
    .update({
      ...updates,
      listened: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates overall rating and thoughts on an album entry.
 *
 * @param {string} entryId - the album_ratings row id
 * @param {{ rating?: number, thoughts?: string }} updates
 * @returns the updated album_ratings row
 */
export const updateAlbumRating = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('album_ratings')
    .update({
      ...updates,
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Checks if an entry exists for an album and returns it
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} albumId - the album id returned by iTunes api
 * @returns Object with album rating details
 */
export const fetchAlbumRating = async (userId, albumId) => {
  const { data, error } = await supabase
    .from('album_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('album_id', albumId);

  if (error) throw error;
  return data.length > 0 ? data[0] : null;
};

/**
 * Checks if a user has album entries and returns all of them
 *
 * @param {string} userId - the user id returned by auth context
 * @returns list of albums journal entries
 */
export const fetchAllAlbumRatings = async (userId) => {
  const { data, error } = await supabase
    .from('album_ratings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

/**
 * Checks if a user has track entries and returns all of them
 *
 * @param {string} userId - the user id returned by auth context
 * @returns list of track journal entries
 */
export const fetchAllTrackRatings = async (userId) => {
  const { data, error } = await supabase
    .from('track_ratings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

/**
 * Inserts a row into the album_ratings table, returns the new entry
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} album - the album object returned by iTunes api
 * @returns Object with the newly created album rating object
 */
export const createAlbumSession = async (userId, album) => {
  const { data, error } = await supabase
    .from('album_ratings')
    .insert([
      {
        user_id: userId,
        album_id: album.collectionId,
        album_title: album.collectionName,
        artist_name: album.artistName,
        artwork_url: album.artworkUrl100,
        release_date: album.releaseDate,
        status: 'in_progress',
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Get all track ratings for an album regardless of entry_id
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} albumId - the album id returned by iTunes api
 * @returns List of objects with the track ratings for songs in album
 */
export const fetchTrackRatings = async (userId, albumId) => {
  const { data, error } = await supabase
    .from('track_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('album_id', albumId);

  if (error) throw error;
  return data;
};

/**
 * Get the track rating for a track with songId
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} songId - the album id returned by iTunes api
 * @returns Object with track rating details
 */
export const fetchTrackRating = async (userId, songId) => {
  const { data, error } = await supabase
    .from('track_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('track_id', songId);

  if (error) throw error;
  return data.length > 0 ? data[0] : null;
};

/**
 * Updates rows in track_ratings when a new listening session is started
 *
 * @param {string} entryId - the album ratings id
 * @param {string} albumId - the album id returned by the iTunes api
 * @param {string} userId - the user id returned by auth context
 */
export const linkStandaloneRatings = async (entryId, albumId, userId) => {
  const { error } = await supabase
    .from('track_ratings')
    .update({ entry_id: entryId })
    .eq('user_id', userId)
    .eq('album_id', albumId);

  if (error) throw error;
};

/**
 * Get a user's listen list
 *
 * @param {text} userId - the userId returned by auth context
 * @returns list of db entries for a user's listen list, empty if none
 */
export const fetchListenList = async (userId) => {
  const { data: listen_list, error } = await supabase
    .from('listen_list')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return listen_list;
};

/**
 * Insert a song or album into a user's listen list
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} type - the type of media (song or album)
 * @param {Object} media - the media object returned by iTunes API
 */
export const insertListenList = async (userId, type, media) => {
  const { error } = await supabase.from('listen_list').insert([
    {
      user_id: userId,
      media_id: type === 'album' ? media.collectionId : media.trackId,
      media_title: type === 'album' ? media.collectionName : media.trackName,
      media_release_date: media.releaseDate,
      media_type: type,
      artist_name: media.artistName,
      artwork_url: media.artworkUrl100,
    },
  ]);

  if (error) throw error;
};

/**
 * Remove a song or album from a user's listen list
 *
 * @param {string} userId - the user id returned by auth context
 * @param {string} type - the type of media (song or album)
 * @param {Object} media - the media object returned by iTunes API
 */
export const deleteListenList = async (userId, type, media) => {
  const { error } = await supabase
    .from('listen_list')
    .delete()
    .eq('user_id', userId)
    .eq('media_id', type === 'album' ? media.collectionId : media.trackId);

  if (error) throw error;
};

export default supabase;
