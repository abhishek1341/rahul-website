export type CategorySlug =
  | 'bts'
  | 'coffee'
  | 'gym'
  | 'influencer'
  | 'jewelery'
  | 'product'
  | 'realestate';

export type PortfolioItem = {
  id: string;
  title: string;
  client: string;
  category: CategorySlug;
  previewSrc: string;
  fullSrc: string;
  /** Full-clip length in seconds (for the card duration badge). */
  durationSec: number;
  /**
   * Source video width / height, when known. The grid tile is a fixed 9:16
   * portrait — clips shot square or landscape lose a large fraction of their
   * width under `object-fit: cover`, which regularly clipped burned-in
   * captions. VideoCard uses this to decide whether a card needs the
   * letterboxed (blurred-backdrop + contain) treatment instead of a plain
   * cover crop. Undefined (unknown aspect) falls back to the plain crop.
   */
  sourceAspect?: number;
  featured?: boolean;
};

export type Category = {
  slug: CategorySlug;
  label: string;
};

// Chip order in the filter bar; 'All' is prepended by CategoryFilter.
export const CATEGORIES: Category[] = [
  { slug: 'coffee', label: 'Coffee & F&B' },
  { slug: 'gym', label: 'Gym' },
  { slug: 'bts', label: 'BTS' },
  { slug: 'influencer', label: 'Influencer' },
  { slug: 'jewelery', label: 'Jewelery' },
  { slug: 'product', label: 'Product' },
  { slug: 'realestate', label: 'Real Estate' },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [];

const CATEGORY_LABELS: Record<CategorySlug, string> = CATEGORIES.reduce(
  (labels, category) => {
    labels[category.slug] = category.label;
    return labels;
  },
  {} as Record<CategorySlug, string>
);

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORY_LABELS[slug];
}
