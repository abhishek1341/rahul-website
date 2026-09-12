export type HeroStory = {
  src: string;
  /** Optional stacked caption lines for this clip only. */
  overlayLines?: string[];
};

/** Add another clip by appending an item — the player is not limited to 2. */
export const heroStories: HeroStory[] = [
  {
    src: '/Low%20mb%20videos/Website%20video/video-02-website.mp4',
  },
  {
    src: '/Low%20mb%20videos/Website%20video/video-01-website.mp4',
  },
];
