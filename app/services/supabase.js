import 'react-native-url-polyfill/auto';
import { GoTrueClient } from '@supabase/gotrue-js';
import { PostgrestClient } from '@supabase/postgrest-js';

export const supabaseUrl = '';
export const supabaseAnonKey = ''; 

// Clientul de autentificare
export const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
});


export const getAuthorizedDb = async () => {
  const session = await auth.getSession();
  const token = session.data.session?.access_token;

  return new PostgrestClient(`${supabaseUrl}/rest/v1`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });
};
