import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';

let ready = false;

export async function setupPlayer() {
  if (ready) return;
  try {
    await TrackPlayer.setupPlayer();
  } catch {
    // already initialised (fast refresh)
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
  ready = true;
}

export async function playEpisode(ep: { id: string; title: string; audioUrl: string; image?: string }, artist: string) {
  await setupPlayer();
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: ep.id,
    url: ep.audioUrl,
    title: ep.title,
    artist,
    artwork: ep.image,
  });
  await TrackPlayer.play();
}
