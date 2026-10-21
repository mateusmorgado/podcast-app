import { Episode } from './rss';

// Sample data for previews before the real feed and Supabase project exist.
const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const DEMO_EPISODES: Episode[] = [
  {
    id: 'demo-430',
    number: '430',
    title: 'Fred Bruno toma tiro em balada, sem bets influencers voltam a trabalhar e mais',
    description: 'As fofocas da semana comentadas sem filtro.',
    audioUrl: SAMPLE_AUDIO,
    image: require('../../assets/demo/ep430.jpg'),
    publishedAt: '',
  },
  {
    id: 'demo-391',
    number: '391',
    title: 'Masterchef Profissionais: está liberado apoiar o Marcelo ou não?',
    description: 'Debate quente direto da cozinha.',
    audioUrl: SAMPLE_AUDIO,
    image: require('../../assets/demo/ep391.jpg'),
    publishedAt: '',
  },
];

export const DEMO_EXCLUSIVE: Episode[] = [
  {
    id: 'demo-392',
    number: '392',
    title: 'Me conte um conselho: não quero que minha mãe poste foto do meu filho!',
    description: 'Proibidão, só para apoiadores.',
    audioUrl: SAMPLE_AUDIO,
    image: require('../../assets/demo/ep392.jpg'),
    publishedAt: '',
    exclusive: true,
  },
];
