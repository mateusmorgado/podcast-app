# Podcast App (white-label)

React Native (Expo) app for a podcaster: public episodes from their RSS feed, exclusive episodes for paying subscribers, background audio.

## Stack
- Expo + React Native, `react-native-track-player` (background audio, lock screen controls)
- Supabase: login, database, private audio storage
- Mercado Pago Subscriptions: the podcaster's own account, money goes straight to them
- Supabase Edge Function: receives the payment webhook and unlocks the subscriber

## Setup
1. `npm install`
2. Edit `src/config.ts`: feed URL, Supabase keys, subscription link, name, color.
3. Supabase: create a project, run `supabase/schema.sql` in the SQL editor.
   In Auth settings, turn on **email confirmation** (access is tied to the email).
4. Mercado Pago (podcaster's account): create a subscription plan in the panel and paste its link in `config.ts`.
   Create an app in Mercado Pago Developers, set the webhook URL to the deployed function, enable the **Subscriptions** topic, and copy the access token and webhook secret.
5. Deploy the function:
   ```
   supabase functions deploy mercadopago-webhook --no-verify-jwt
   supabase secrets set MP_ACCESS_TOKEN=... MP_WEBHOOK_SECRET=...
   ```
6. Upload exclusive audio to the `exclusive-audio` bucket (Supabase dashboard) and add a row in `exclusive_episodes` with its `audio_path`.
7. Run on a device: `npx expo run:android` or `npx expo run:ios`.
   `react-native-track-player` does **not** work in Expo Go, you need a dev build.

## Known gaps (next steps)
- No admin screen: the podcaster uploads exclusive audio and adds rows in the Supabase dashboard.
- Subscription is matched by email, so the buyer must pay with the same email they used in the app.
- Icons, splash screen and store assets are not included.
- Not yet tested on a device. Expect small fixes on first run.
- Check current Apple/Google in-app purchase rules for Brazil before publishing.
