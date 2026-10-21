// Installs the web loader for lazily loaded chunks (track-player loads shaka-player that way).
import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { PlaybackService } from './src/lib/playbackService';

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
