import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import { BORDER, COLORS, FONTS } from '../theme';

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

function RoundButton({ label, onPress, big }: { label: string; onPress: () => void; big?: boolean }) {
  const size = big ? 48 : 38;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: big ? COLORS.ink : COLORS.paper,
        ...BORDER,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: big ? COLORS.paper : COLORS.ink, fontFamily: FONTS.bold, fontSize: big ? 20 : 14 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function MiniPlayer() {
  const track = useActiveTrack();
  const state = usePlaybackState().state;
  const { position, duration } = useProgress(500);

  if (!track) return null;
  const playing = state === State.Playing;
  const pct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={{ backgroundColor: COLORS.yellow, borderTopWidth: 2, borderColor: COLORS.ink, padding: 12 }}>
      <View style={{ height: 8, backgroundColor: COLORS.paper, ...BORDER, borderRadius: 6, marginBottom: 10, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: COLORS.pink }} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.ink, fontFamily: FONTS.bold, fontSize: 16, textTransform: 'uppercase' }} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={{ color: COLORS.muted, fontFamily: FONTS.semibold, fontSize: 13 }}>
            {fmt(position)} / {fmt(duration)}
          </Text>
        </View>
        <RoundButton label="-15" onPress={() => TrackPlayer.seekBy(-15)} />
        <RoundButton big label={playing ? '❚❚' : '▶'} onPress={() => (playing ? TrackPlayer.pause() : TrackPlayer.play())} />
        <RoundButton label="+30" onPress={() => TrackPlayer.seekBy(30)} />
      </View>
    </View>
  );
}
