'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ServiceList } from '@/data/services';

const PREVIEW_COUNT = 6;

export default function ServiceChipList({ title, items }: ServiceList) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = items.length > PREVIEW_COUNT;
  const visible = needsToggle && !expanded ? items.slice(0, PREVIEW_COUNT) : items;

  return (
    <div className="service-chip-list">
      <h4 className="service-chip-list-title">{title}</h4>
      <ul className="service-chip-grid">
        {visible.map((item) => (
          <li key={item} className="service-chip">
            {item}
          </li>
        ))}
      </ul>
      {needsToggle ? (
        <button
          type="button"
          className="service-show-more"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className={`service-show-more-chevron${expanded ? ' service-show-more-chevron--open' : ''}`}
          />
        </button>
      ) : null}
    </div>
  );
}
