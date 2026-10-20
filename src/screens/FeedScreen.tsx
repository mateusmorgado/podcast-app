import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { CONFIG } from '../config';
import { Episode, fetchFeed } from '../lib/rss';
import { playEpisode } from '../lib/player';

export default function FeedScreen() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setEpisodes(await fetchFeed(CONFIG.publicFeedUrl));
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

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={CONFIG.accentColor} />;
  if (error) return <Text style={{ color: '#f66', padding: 16 }}>{error}</Text>;

  return (
    <FlatList
      data={episodes}
      keyExtractor={(e) => e.id}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        load();
      }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => playEpisode(item, CONFIG.appName)}
          style={{ flexDirection: 'row', gap: 12, backgroundColor: '#151517', borderRadius: 12, padding: 12 }}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 8 }} />
          ) : null}
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }} numberOfLines={2}>{item.title}</Text>
            <Text style={{ color: '#888', marginTop: 4 }} numberOfLines={2}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
