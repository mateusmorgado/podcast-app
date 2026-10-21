// Visual identity: flat pastel backgrounds, black "EP" tags, white boxes with thin black outlines,
// condensed bold uppercase type. Swap these per podcaster along with config.ts.
export const COLORS = {
  pink: '#EBAFE3',
  sky: '#8CC8F5',
  yellow: '#F7E64F',
  mint: '#6FD39A',
  ink: '#111111',
  paper: '#FFFFFF',
  muted: '#555555',
};

// Episode cards cycle through these, like the covers do.
export const PASTELS = [COLORS.pink, COLORS.sky, COLORS.yellow, COLORS.mint];

export const FONTS = {
  regular: 'BarlowCondensed_500Medium',
  semibold: 'BarlowCondensed_600SemiBold',
  bold: 'BarlowCondensed_700Bold',
  black: 'BarlowCondensed_800ExtraBold',
};

export const BORDER = { borderWidth: 2, borderColor: COLORS.ink } as const;
