import type { LucideIcon } from 'lucide-react';
import {
  Clapperboard,
  Globe,
  Lightbulb,
  Megaphone,
  Share2,
  Sparkles,
  Target,
  UserRound,
  Users,
  Video,
} from 'lucide-react';

const SERVICE_ICONS: Record<string, LucideIcon> = {
  'content-creation': Clapperboard,
  'video-production': Video,
  'social-media-management': Share2,
  'meta-ads': Megaphone,
  'lead-generation': Target,
  'influencer-marketing': Users,
  'personal-branding': UserRound,
  'website-development': Globe,
  'ai-video-generation': Sparkles,
  'creative-strategy': Lightbulb,
};

export function ServiceIcon({ id }: { id: string }) {
  const Icon = SERVICE_ICONS[id] ?? Clapperboard;
  return <Icon size={18} strokeWidth={1.75} aria-hidden="true" />;
}
