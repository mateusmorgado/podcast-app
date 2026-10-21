import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../config';
import { ExclusiveEpisode, isSubscriber, listExclusive, signedAudioUrl } from '../lib/supabase';
import { DEMO_EXCLUSIVE } from '../lib/demo';
import { playEpisode } from '../lib/player';
import EpisodeCard from '../components/EpisodeCard';
import { Box, Button, Sparkle, heading } from '../components/ui';
import { BORDER, COLORS, FONTS } from '../theme';
import { imageSource } from './FeedScreen';

type Props = { signedIn: boolean; onNeedLogin: () => void };

export default function ExclusiveScreen({ signedIn, onNeedLogin }: Props) {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [items, setItems] = useState<ExclusiveEpisode[]>([]);
  const [demoUnlocked, setDemoUnlocked] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const sub = signedIn ? await isSubscriber() : false;
      setSubscribed(sub);
      setItems(sub ? await listExclusive() : []);
    } catch {
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (CONFIG.demoMode) setLoading(false);
    else refresh();
  }, [signedIn]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.ink} />;

  if (CONFIG.demoMode && demoUnlocked) {
    return (
      <FlatList
        data={DEMO_EXCLUSIVE}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        ListFooterComponent={
          <TouchableOpacity onPress={() => setDemoUnlocked(false)} style={{ alignItems: 'center', padding: 12 }}>
            <Text style={{ fontFamily: FONTS.semibold, color: COLORS.muted }}>Prévia: voltar para tela bloqueada</Text>
          </TouchableOpacity>
        }
        renderItem={({ item, index }) => (
          <EpisodeCard
            index={index + 1}
            locked
            title={item.title}
            description={item.description}
            number={item.number}
            image={imageSource(item.image)}
            onPress={() => playEpisode(item, CONFIG.appName)}
          />
        )}
      />
    );
  }

  if (CONFIG.demoMode || !signedIn || !subscribed) {
    const needLogin = !CONFIG.demoMode && !signedIn;
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Gate
          text={needLogin ? 'Entre na sua conta para acessar o conteúdo exclusivo.' : 'Episódios extras, sem cortes, só para quem apoia o podcast.'}
          button={needLogin ? 'Entrar' : 'Quero apoiar'}
          onPress={needLogin ? onNeedLogin : () => Linking.openURL(CONFIG.subscribeUrl)}
        />
        {CONFIG.demoMode ? (
          <TouchableOpacity onPress={() => setDemoUnlocked(true)} style={{ alignItems: 'center', padding: 14 }}>
            <Text style={{ fontFamily: FONTS.semibold, color: COLORS.muted }}>Prévia: ver como apoiador</Text>
          </TouchableOpacity>
        ) : !needLogin ? (
          <TouchableOpacity onPress={refresh} style={{ alignItems: 'center', padding: 14 }}>
            <Text style={{ fontFamily: FONTS.semibold, color: COLORS.muted }}>Já assinei, atualizar</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(e) => e.id}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      renderItem={({ item, index }) => (
        <EpisodeCard
          index={index + 1}
          locked
          title={item.title}
          description={item.description ?? undefined}
          onPress={async () => {
            try {
              const audioUrl = await signedAudioUrl(item.audio_path);
              await playEpisode({ id: item.id, title: item.title, audioUrl }, CONFIG.appName);
            } catch {
              Alert.alert('Erro', 'Não foi possível tocar este episódio.');
            }
          }}
        />
      )}
    />
  );
}

// Styled after the "PROIBIDÃO para apoiadores" cover.
function Gate({ text, button, onPress }: { text: string; button: string; onPress: () => void }) {
  return (
    <View style={{ backgroundColor: COLORS.sky, ...BORDER, borderRadius: 16, padding: 20, alignItems: 'center', gap: 14 }}>
      <Sparkle size={22} style={{ position: 'absolute', top: 10, right: 16 }} />
      <Text style={[heading, { fontSize: 46, letterSpacing: 1, marginTop: 6 }]}>Proibidão</Text>
      <View style={{ ...BORDER, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 2, marginTop: -12, transform: [{ rotate: '-3deg' }] }}>
        <Text style={{ fontFamily: FONTS.bold, fontSize: 16, color: COLORS.ink, textTransform: 'uppercase' }}>para apoiadores</Text>
      </View>
      <Box style={{ alignSelf: 'stretch' }}>
        <Text style={{ fontFamily: FONTS.semibold, fontSize: 18, color: COLORS.ink, textAlign: 'center' }}>{text}</Text>
      </Box>
      <Button label={button} onPress={onPress} />
    </View>
  );
}
