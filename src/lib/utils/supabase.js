import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchListenList = async (user) => {
  const { data: listen_list, error } = await supabase
    .from('listen_list')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return listen_list;
};

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

export const deleteListenList = async (user, album) => {
  const { error } = await supabase
    .from('listen_list')
    .delete()
    .eq('user_id', user.id)
    .eq('album_id', album.collectionId);

  if (error) throw error;
};

export default supabase;
