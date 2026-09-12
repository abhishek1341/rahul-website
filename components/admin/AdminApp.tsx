'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteContent } from '@/lib/content/types';
import LogosPanel from './LogosPanel';
import PortfolioPanel from './PortfolioPanel';
import NumbersPanel from './NumbersPanel';

type Tab = 'logos' | 'portfolio' | 'numbers';

const TABS: { id: Tab; label: string }[] = [
  { id: 'logos', label: 'Logos' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'numbers', label: 'Numbers' },
];

export default function AdminApp({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('logos');
  const [content, setContent] = useState(initialContent);
  const [message, setMessage] = useState('');

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-app">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Suntrix Media</p>
          <h1>Admin</h1>
        </div>
        <button type="button" className="admin-text-btn" onClick={signOut}>
          Sign out
        </button>
      </header>

      <nav className="admin-tabs" aria-label="Admin sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-tab${tab === item.id ? ' admin-tab--active' : ''}`}
            aria-pressed={tab === item.id}
            onClick={() => {
              setTab(item.id);
              setMessage('');
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {message ? <p className="admin-banner">{message}</p> : null}

      {tab === 'logos' ? (
        <LogosPanel
          logos={content.logos}
          onChange={(logos) => setContent((current) => ({ ...current, logos }))}
          onMessage={setMessage}
        />
      ) : null}

      {tab === 'portfolio' ? (
        <PortfolioPanel
          videos={content.videos}
          onChange={(videos) => setContent((current) => ({ ...current, videos }))}
          onMessage={setMessage}
        />
      ) : null}

      {tab === 'numbers' ? (
        <NumbersPanel
          stats={content.stats}
          onChange={(stats) => setContent((current) => ({ ...current, stats }))}
          onMessage={setMessage}
        />
      ) : null}
    </div>
  );
}
