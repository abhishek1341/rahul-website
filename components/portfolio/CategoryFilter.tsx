'use client';

import type { Category, CategorySlug } from '@/data/portfolio';
import Container from '@/components/layout/Container';

export type FilterValue = 'all' | CategorySlug;

interface CategoryFilterProps {
  categories: Category[];
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  const options: { value: FilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    ...categories.map((category) => ({
      value: category.slug as FilterValue,
      label: category.label,
    })),
  ];

  return (
    <div className="portfolio-filter-bar w-full">
      <Container>
        <div className="portfolio-filter-row relative">
          <div
            className="portfolio-scroller flex gap-2 overflow-x-auto py-3 lg:flex-wrap lg:justify-center lg:overflow-x-visible lg:py-4"
            role="group"
            aria-label="Filter work by category"
          >
            {options.map((option) => {
              const isActive = option.value === active;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-pressed={isActive}
                  className={`portfolio-chip flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold uppercase leading-none tracking-[0.06em] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${
                    isActive ? 'portfolio-chip--active' : 'portfolio-chip--idle'
                  }`}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="portfolio-chip-dot h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                  )}
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* 32px edge fade — hard-clip otherwise reads as a cut-off chip. */}
          <div
            aria-hidden="true"
            className="portfolio-filter-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-8 lg:hidden"
          />
        </div>
      </Container>
    </div>
  );
}
