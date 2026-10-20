import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../config';
import { ExclusiveEpisode, isSubscriber, listExclusive, signedAudioUrl } from '../lib/supabase';
import { playEpisode } from '../lib/player';

type Props = { signedIn: boolean; onNeedLogin: () => void };

export default function ExclusiveScreen({ signedIn, onNeedLogin }: Props) {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [items, setItems] = useState<ExclusiveEpisode[]>([]);

  const refresh = async () => {
    setLoading(true);
    try {
      const sub = signedIn ? await isSubscriber() : false;
      setSubscribed(sub);
      setItems(sub ? await listExclusive() : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [signedIn]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={CONFIG.accentColor} />;

  if (!signedIn) {
    return (
      <Gate
        text="Entre na sua conta para acessar o conteúdo exclusivo."
        button="Entrar"
        onPress={onNeedLogin}
      />
    );
  }

  if (!subscribed) {
    return (
      <View>
        <Gate
          text="Conteúdo exclusivo para apoiadores."
          button="Quero apoiar"
          onPress={() => Linking.openURL(CONFIG.subscribeUrl)}
        />
        <TouchableOpacity onPress={refresh} style={{ alignItems: 'center' }}>
          <Text style={{ color: '#888' }}>Já assinei, atualizar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(e) => e.id}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={async () =>
            playEpisode(
              { id: item.id, title: item.title, audioUrl: await signedAudioUrl(item.audio_path) },
              CONFIG.appName,
            )
          }
          style={{ backgroundColor: '#151517', borderRadius: 12, padding: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{item.title}</Text>
          {item.description ? <Text style={{ color: '#888', marginTop: 4 }}>{item.description}</Text> : null}
        </TouchableOpacity>
      )}
    />
  );
}

function Gate({ text, button, onPress }: { text: string; button: string; onPress: () => void }) {
  return (
    <View style={{ padding: 24, alignItems: 'center', gap: 16 }}>
      <Text style={{ color: '#ddd', textAlign: 'center' }}>{text}</Text>
      <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: CONFIG.accentColor, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>{button}</Text>
      </TouchableOpacity>
    </View>
  );
}
