import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { setupPlayer } from './src/lib/player';
import { supabase } from './src/lib/supabase';
import { CONFIG } from './src/config';
import FeedScreen from './src/screens/FeedScreen';
import ExclusiveScreen from './src/screens/ExclusiveScreen';
import LoginScreen from './src/screens/LoginScreen';
import MiniPlayer from './src/screens/MiniPlayer';

type Tab = 'feed' | 'exclusive';

export default function App() {
  const [tab, setTab] = useState<Tab>('feed');
  const [signedIn, setSignedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setupPlayer();
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSignedIn(!!s);
      if (s) setShowLogin(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (showLogin) return <LoginScreen onCancel={() => setShowLogin(false)} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0c' }}>
      <StatusBar barStyle="light-content" />
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{CONFIG.appName}</Text>
        {signedIn ? (
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <Text style={{ color: '#999' }}>Sair</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowLogin(true)}>
            <Text style={{ color: CONFIG.accentColor }}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8 }}>
        {(['feed', 'exclusive'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: tab === t ? CONFIG.accentColor : '#1c1c1f',
            }}>
            <Text style={{ color: '#fff' }}>{t === 'feed' ? 'Episódios' : 'Exclusivo'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'feed' ? <FeedScreen /> : <ExclusiveScreen signedIn={signedIn} onNeedLogin={() => setShowLogin(true)} />}
      </View>
      <MiniPlayer />
    </SafeAreaView>
  );
}
