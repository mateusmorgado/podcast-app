import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import { CONFIG } from '../config';

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export default function MiniPlayer() {
  const track = useActiveTrack();
  const state = usePlaybackState().state;
  const { position, duration } = useProgress(500);

  if (!track) return null;
  const playing = state === State.Playing;
  const pct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={{ backgroundColor: '#151517', padding: 12 }}>
      <View style={{ height: 3, backgroundColor: '#2a2a2e', borderRadius: 2, marginBottom: 10 }}>
        <View style={{ height: 3, width: `${pct}%`, backgroundColor: CONFIG.accentColor, borderRadius: 2 }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff' }} numberOfLines={1}>{track.title}</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>{fmt(position)} / {fmt(duration)}</Text>
        </View>
        <TouchableOpacity onPress={() => TrackPlayer.seekBy(-15)}><Text style={{ color: '#fff' }}>-15</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => (playing ? TrackPlayer.pause() : TrackPlayer.play())}>
          <Text style={{ color: CONFIG.accentColor, fontSize: 18 }}>{playing ? 'Pausar' : 'Tocar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.seekBy(30)}><Text style={{ color: '#fff' }}>+30</Text></TouchableOpacity>
      </View>
    </View>
  );
}
