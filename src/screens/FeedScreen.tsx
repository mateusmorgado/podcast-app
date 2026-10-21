import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';
import { CONFIG } from '../config';
import { Episode, fetchFeed } from '../lib/rss';
import { DEMO_EPISODES } from '../lib/demo';
import { playEpisode } from '../lib/player';
import EpisodeCard from '../components/EpisodeCard';
import { COLORS, FONTS } from '../theme';

// Feed images are URLs; demo covers are bundled assets (a number on native, an object on web).
export const imageSource = (image?: string | number) =>
  image == null ? undefined : typeof image === 'string' ? { uri: image } : image;

export default function FeedScreen() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setEpisodes(CONFIG.demoMode ? DEMO_EPISODES : await fetchFeed(CONFIG.publicFeedUrl));
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.ink} />;
  if (error) return <Text style={{ color: COLORS.ink, fontFamily: FONTS.semibold, padding: 16 }}>{error}</Text>;

  return (
    <FlatList
      data={episodes}
      keyExtractor={(e) => e.id}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        load();
      }}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      renderItem={({ item, index }) => (
        <EpisodeCard
          index={index}
          featured={index === 0}
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
