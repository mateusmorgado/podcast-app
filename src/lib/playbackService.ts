import TrackPlayer, { Event } from 'react-native-track-player';

// Runs in the background so lock-screen and headset buttons keep working.
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (e) =>
    TrackPlayer.seekBy(e.interval ?? 30));
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (e) =>
    TrackPlayer.seekBy(-(e.interval ?? 15)));
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position));
}
