import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useFonts } from 'expo-font';
// Per-weight imports so only these four font files are bundled.
import { BarlowCondensed_500Medium } from '@expo-google-fonts/barlow-condensed/500Medium';
import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { BarlowCondensed_800ExtraBold } from '@expo-google-fonts/barlow-condensed/800ExtraBold';
import { setupPlayer } from './src/lib/player';
import { supabase } from './src/lib/supabase';
import { CONFIG } from './src/config';
import { BORDER, COLORS, FONTS } from './src/theme';
import { Sparkle } from './src/components/ui';
import FeedScreen from './src/screens/FeedScreen';
import ExclusiveScreen from './src/screens/ExclusiveScreen';
import LoginScreen from './src/screens/LoginScreen';
import MiniPlayer from './src/screens/MiniPlayer';

type Tab = 'feed' | 'exclusive';

export default function App() {
  const [tab, setTab] = useState<Tab>('feed');
  const [signedIn, setSignedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [fontsLoaded] = useFonts({
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
    BarlowCondensed_800ExtraBold,
  });

  useEffect(() => {
    setupPlayer().then(() => setPlayerReady(true));
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSignedIn(!!s);
      if (s) setShowLogin(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: COLORS.yellow }} />;
  if (showLogin) return <LoginScreen onCancel={() => setShowLogin(false)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.yellow }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ padding: 16, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexShrink: 1 }}>
          <Sparkle size={16} style={{ position: 'absolute', top: -10, right: -12, zIndex: 1 }} />
          <View style={{ backgroundColor: COLORS.paper, ...BORDER, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontFamily: FONTS.black, fontSize: 24, color: COLORS.ink, textTransform: 'uppercase' }} numberOfLines={1}>
              {CONFIG.appName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => (signedIn ? supabase.auth.signOut() : setShowLogin(true))}
          style={{ backgroundColor: COLORS.ink, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginLeft: 10 }}>
          <Text style={{ color: COLORS.paper, fontFamily: FONTS.bold, fontSize: 16 }}>{signedIn ? 'SAIR' : 'ENTRAR'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
        {(['feed', 'exclusive'] as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 18,
                borderRadius: 20,
                ...BORDER,
                backgroundColor: active ? COLORS.ink : COLORS.paper,
              }}>
              <Text style={{ color: active ? COLORS.paper : COLORS.ink, fontFamily: FONTS.bold, fontSize: 17, textTransform: 'uppercase' }}>
                {t === 'feed' ? 'Episódios' : 'Exclusivo'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'feed' ? <FeedScreen /> : <ExclusiveScreen signedIn={signedIn} onNeedLogin={() => setShowLogin(true)} />}
      </View>
      {/* The player hooks throw if they run before setup finishes. */}
      {playerReady ? <MiniPlayer /> : null}
    </SafeAreaView>
  );
}
