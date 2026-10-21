import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BORDER, COLORS, FONTS } from '../theme';

// Black rounded "EP 392" tag from the covers.
export function EpTag({ number, style }: { number: string; style?: ViewStyle }) {
  return (
    <View
      style={[
        { backgroundColor: COLORS.ink, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
        style,
      ]}>
      <Text style={{ color: COLORS.paper, fontFamily: FONTS.semibold, fontSize: 16 }}>EP {number}</Text>
    </View>
  );
}

// White outlined box with condensed uppercase text.
export function Box({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ backgroundColor: COLORS.paper, ...BORDER, padding: 12 }, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  color = COLORS.ink,
  textColor = COLORS.paper,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        { backgroundColor: color, ...BORDER, borderRadius: 24, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' },
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}>
      <Text style={{ color: textColor, fontFamily: FONTS.bold, fontSize: 18, textTransform: 'uppercase' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export const heading: TextStyle = {
  fontFamily: FONTS.black,
  color: COLORS.ink,
  textTransform: 'uppercase',
};

export function Sparkle({ size = 18, style }: { size?: number; style?: TextStyle }) {
  return <Text style={[{ color: COLORS.paper, fontSize: size, textShadowColor: COLORS.ink, textShadowRadius: 1 }, style]}>✦</Text>;
}
