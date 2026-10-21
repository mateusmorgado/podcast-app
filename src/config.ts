// White-label config: one file per podcaster. Change these and rebuild.
export const CONFIG = {
  appName: 'Me Conte Uma Fofoca',
  // Shows sample episodes instead of reading the feed and Supabase. Turn off once real URLs are set.
  demoMode: true,
  // Public feed from the podcaster's existing host (Spotify for Creators, Podigee, etc.)
  publicFeedUrl: 'https://example.com/feed.xml',
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-KEY',
  // Mercado Pago subscription plan link, created by the podcaster in their own account
  subscribeUrl: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=YOUR_PLAN_ID',
  accentColor: '#E5484D',
};
