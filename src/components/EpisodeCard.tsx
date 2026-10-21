import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';
import { BORDER, COLORS, FONTS, PASTELS } from '../theme';
import { EpTag } from './ui';

type Props = {
  index: number;
  title: string;
  description?: string;
  number?: string;
  image?: ImageSourcePropType;
  locked?: boolean;
  featured?: boolean;
  onPress: () => void;
};

// Pastel tile with the cover, then the white outlined title box with the EP tag sitting on top, like the covers.
export default function EpisodeCard({ index, title, description, number, image, locked, featured, onPress }: Props) {
  if (featured) {
    // Latest episode: full-width cover, title box underneath.
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{ backgroundColor: PASTELS[index % PASTELS.length], ...BORDER, borderRadius: 16, padding: 14 }}>
        {image ? (
          <View style={{ width: '100%', aspectRatio: 1, borderRadius: 10, ...BORDER, overflow: 'hidden', marginBottom: 12 }}>
            <Image source={image} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} />
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 14, color: COLORS.ink, marginBottom: 4 }}>▶ OUVIR AGORA</Text>
          {number ? <EpTag number={number} /> : null}
        </View>
        <View style={{ backgroundColor: COLORS.paper, ...BORDER, paddingHorizontal: 12, paddingVertical: 10 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 22, lineHeight: 24, color: COLORS.ink, textTransform: 'uppercase' }}>{title}</Text>
          {description ? (
            <Text style={{ fontFamily: FONTS.regular, fontSize: 15, color: COLORS.muted, marginTop: 4 }} numberOfLines={3}>
              {description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ backgroundColor: PASTELS[index % PASTELS.length], ...BORDER, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12 }}>
      {image ? (
        <Image source={image} style={{ width: 84, height: 84, borderRadius: 10, ...BORDER }} />
      ) : null}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {locked ? (
            <View style={{ backgroundColor: COLORS.mint, ...BORDER, borderBottomWidth: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 8, paddingVertical: 1, marginRight: 6 }}>
              <Text style={{ fontFamily: FONTS.bold, fontSize: 13, color: COLORS.ink }}>APOIADORES</Text>
            </View>
          ) : null}
          {number ? <EpTag number={number} /> : null}
        </View>
        <View style={{ backgroundColor: COLORS.paper, ...BORDER, paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text style={{ fontFamily: FONTS.bold, fontSize: 17, lineHeight: 19, color: COLORS.ink, textTransform: 'uppercase' }} numberOfLines={3}>
            {title}
          </Text>
          {description ? (
            <Text style={{ fontFamily: FONTS.regular, fontSize: 14, color: COLORS.muted, marginTop: 2 }} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}
