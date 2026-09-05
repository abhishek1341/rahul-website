/** Shared muted-autoplay helpers for iOS Safari / Low Power Mode. */

export function armMutedVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
}

export function tryPlayMuted(video: HTMLVideoElement) {
  armMutedVideo(video);
  return video.play().catch(() => {
    // NotAllowedError is normal on iOS until the file has data or a tap
    // unlocks media. Callers retry; they should not treat this as fatal.
  });
}
