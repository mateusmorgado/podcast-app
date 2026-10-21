import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';

let setup: Promise<void> | null = null;

// Shared promise: the app and the first tap can both call this without racing.
export function setupPlayer(): Promise<void> {
  setup ??= (async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (e) {
      // Throws "already initialized" after a fast refresh; anything else is worth seeing.
      console.warn('setupPlayer', e);
    }
    await TrackPlayer.updateOptions({
      android: { appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.JumpForward,
        Capability.JumpBackward,
      ],
      forwardJumpInterval: 30,
      backwardJumpInterval: 15,
    });
  })();
  return setup;
}

export async function playEpisode(ep: { id: string; title: string; audioUrl: string; image?: string | number }, artist: string) {
  await setupPlayer();
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: ep.id,
    url: ep.audioUrl,
    title: ep.title,
    artist,
    // track-player resolves bundled assets (require) at runtime, but its AddTrack type only says string.
    artwork: ep.image as string | undefined,
  });
  await TrackPlayer.play();
}
