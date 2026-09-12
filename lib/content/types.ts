import type { CategorySlug } from '@/data/portfolio';

export type SiteLogo = {
  id: string;
  src: string;
  name: string;
  alt: string;
};

export type SiteVideo = {
  id: string;
  src: string;
  title: string;
  description: string;
  category: CategorySlug;
};

export type SiteStat = {
  id: string;
  value: number;
  suffix: string;
  label: string;
  subtext?: string;
  visible: boolean;
};

export type SiteResultCase = {
  id: string;
  metrics: SiteStat[];
};

export type SiteContent = {
  logos: SiteLogo[];
  videos: SiteVideo[];
  stats: {
    portfolio: SiteStat[];
    cases: SiteResultCase[];
  };
};
