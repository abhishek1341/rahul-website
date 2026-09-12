'use client';

import { useState } from 'react';
import type { SiteContent, SiteStat } from '@/lib/content/types';

const CASE_LABELS: Record<string, string> = {
  glowhaus: 'Homepage — beauty brand case',
  theo: 'Homepage — clothing brand case',
};

type NumbersPanelProps = {
  stats: SiteContent['stats'];
  onChange: (stats: SiteContent['stats']) => void;
  onMessage: (message: string) => void;
};

function StatFields({
  stat,
  onChange,
}: {
  stat: SiteStat;
  onChange: (stat: SiteStat) => void;
}) {
  return (
    <div className="admin-stat">
      <label className="admin-toggle">
        <input
          type="checkbox"
          checked={stat.visible}
          onChange={(event) => onChange({ ...stat, visible: event.target.checked })}
        />
        <span>Show on website</span>
      </label>
      <label className="admin-field">
        <span>Label</span>
        <input value={stat.label} onChange={(event) => onChange({ ...stat, label: event.target.value })} />
      </label>
      <div className="admin-stat-nums">
        <label className="admin-field">
          <span>Number</span>
          <input
            inputMode="numeric"
            value={String(stat.value)}
            onChange={(event) => onChange({ ...stat, value: Number(event.target.value.replace(/[^\d.]/g, '')) || 0 })}
          />
        </label>
        <label className="admin-field">
          <span>Suffix</span>
          <input value={stat.suffix} onChange={(event) => onChange({ ...stat, suffix: event.target.value })} />
        </label>
      </div>
      {stat.subtext !== undefined ? (
        <label className="admin-field">
          <span>Small print</span>
          <input value={stat.subtext} onChange={(event) => onChange({ ...stat, subtext: event.target.value })} />
        </label>
      ) : null}
    </div>
  );
}

export default function NumbersPanel({ stats, onChange, onMessage }: NumbersPanelProps) {
  const [draft, setDraft] = useState(stats);
  const [pending, setPending] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    onMessage('');

    try {
      const response = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not save numbers');
        return;
      }
      onChange(data);
      setDraft(data);
      onMessage('Numbers saved. Hidden items will not appear on the site.');
    } catch {
      onMessage('Could not save numbers');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-panel" onSubmit={save}>
      <div className="admin-panel-intro">
        <h2>Numbers</h2>
        <p>Edit the counters on Portfolio and Home. Uncheck “Show on website” to hide one without deleting it.</p>
      </div>

      <section className="admin-card">
        <h3>Portfolio strip</h3>
        <p className="admin-muted">Videos Delivered, Total Views, Brands Served.</p>
        <div className="admin-stat-grid">
          {draft.portfolio.map((stat, index) => (
            <StatFields
              key={stat.id}
              stat={stat}
              onChange={(next) => {
                const portfolio = [...draft.portfolio];
                portfolio[index] = next;
                setDraft({ ...draft, portfolio });
              }}
            />
          ))}
        </div>
      </section>

      {draft.cases.map((entry, caseIndex) => (
        <section key={entry.id} className="admin-card">
          <h3>{CASE_LABELS[entry.id] ?? entry.id}</h3>
          <div className="admin-stat-grid">
            {entry.metrics.map((stat, metricIndex) => (
              <StatFields
                key={`${entry.id}-${stat.id}`}
                stat={stat}
                onChange={(next) => {
                  const cases = draft.cases.map((item, index) => {
                    if (index !== caseIndex) return item;
                    const metrics = [...item.metrics];
                    metrics[metricIndex] = next;
                    return { ...item, metrics };
                  });
                  setDraft({ ...draft, cases });
                }}
              />
            ))}
          </div>
        </section>
      ))}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? 'Saving…' : 'Save numbers'}
      </button>
    </form>
  );
}
