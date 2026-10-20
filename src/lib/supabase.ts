import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config';

export const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

export type ExclusiveEpisode = {
  id: string;
  title: string;
  description: string | null;
  audio_path: string;
  published_at: string;
};

export async function isSubscriber(): Promise<boolean> {
  // RLS only returns the row that matches the logged-in user's email.
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('status', 'authorized')
    .maybeSingle();
  return !!data;
}

export async function listExclusive(): Promise<ExclusiveEpisode[]> {
  const { data, error } = await supabase
    .from('exclusive_episodes')
    .select('id, title, description, audio_path, published_at')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Signed URL expires, so exclusive audio can't be shared as a permanent link.
export async function signedAudioUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('exclusive-audio').createSignedUrl(path, 60 * 60 * 6);
  if (error || !data) throw error ?? new Error('No signed URL');
  return data.signedUrl;
}
