'use client';

import { useEffect, useRef, useState } from 'react';

type Option = { value: string; label: string };

type AdminSelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  labelledBy?: string;
};

export default function AdminSelect({ value, options, onChange, labelledBy }: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="admin-select" ref={rootRef}>
      <button
        type="button"
        className="admin-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelledBy}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <span aria-hidden="true" className="admin-select-caret">
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <ul className="admin-select-menu" role="listbox">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`admin-select-option${isActive ? ' admin-select-option--active' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
