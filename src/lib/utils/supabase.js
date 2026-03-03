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
 * Insert an album into a user's listen list
 * 
 * @param {Object} user - the user object returned by auth context
 * @param {Object} album - the album object returned by iTunes API
 */
export const insertListenList = async (user, album) => {
  const { error } = await supabase.from('listen_list').insert([
    {
      user_id: user.id,
      album_id: album.collectionId,
      album_title: album.collectionName,
      artist_name: album.artistName,
      artwork_url: album.artworkUrl100,
    },
  ]);

  if (error) throw error;
};

/**
 * Remove an album from a user's listen list
 * 
 * @param {Object} user - the user object returned by auth context
 * @param {Object} album - the album object returned by iTunes API
 */
export const deleteListenList = async (user, album) => {
  const { error } = await supabase
    .from('listen_list')
    .delete()
    .eq('user_id', user.id)
    .eq('album_id', album.collectionId);

  if (error) throw error;
};

export default supabase;
