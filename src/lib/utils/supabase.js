import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get a user's listen list
 *
 * @param {Object} user - the user object returned by auth context
 * @returns list of db entries for a user's listen list, empty if none
 */
export const fetchListenList = async (user) => {
  const { data: listen_list, error } = await supabase
    .from('listen_list')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return listen_list;
};

/**
 * Insert a song or album into a user's listen list
 *
 * @param {Object} user - the user object returned by auth context
 * @param {string} type - the type of media (song or album)
 * @param {Object} media - the media object returned by iTunes API
 */
export const insertListenList = async (user, type, media) => {
  const { error } = await supabase.from('listen_list').insert([
    {
      user_id: user.id,
      media_id: type === 'album' ? media.collectionId : media.trackId,
      media_title: media.collectionName,
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
 * @param {Object} user - the user object returned by auth context
 * @param {string} type - the type of media (song or album)
 * @param {Object} media - the media object returned by iTunes API
 */
export const deleteListenList = async (user, type, media) => {
  const { error } = await supabase
    .from('listen_list')
    .delete()
    .eq('user_id', user.id)
    .eq('media_id', type === 'album' ? media.collectionId : media.trackId);

  if (error) throw error;
};

export default supabase;
