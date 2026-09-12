'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES, categoryLabel, type CategorySlug } from '@/data/portfolio';
import type { SiteVideo } from '@/lib/content/types';
import AdminFileField from './AdminFileField';
import AdminSelect from './AdminSelect';

const CATEGORY_OPTIONS = CATEGORIES.map((item) => ({ value: item.slug, label: item.label }));

type PortfolioPanelProps = {
  videos: SiteVideo[];
  onChange: (videos: SiteVideo[]) => void;
  onMessage: (message: string) => void;
};

const emptyForm = {
  title: '',
  description: '',
  category: 'coffee' as CategorySlug,
  file: null as File | null,
};

export default function PortfolioPanel({ videos, onChange, onMessage }: PortfolioPanelProps) {
  const [category, setCategory] = useState<CategorySlug | 'all'>('all');
  const [form, setForm] = useState(emptyForm);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyForm);

  const visible = useMemo(
    () => (category === 'all' ? videos : videos.filter((video) => video.category === category)),
    [category, videos],
  );

  async function addVideo(event: React.FormEvent) {
    event.preventDefault();
    if (!form.file) {
      onMessage('Choose an MP4 under 25 MB.');
      return;
    }

    setPending(true);
    onMessage('');
    const payload = new FormData();
    payload.set('title', form.title);
    payload.set('description', form.description);
    payload.set('category', form.category);
    payload.set('file', form.file);

    try {
      const response = await fetch('/api/admin/videos', { method: 'POST', body: payload });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not add video');
        return;
      }
      onChange([...videos, data]);
      setForm(emptyForm);
      onMessage('Video added to the portfolio.');
    } catch {
      onMessage('Could not add video. If the file is large, try a smaller MP4.');
    } finally {
      setPending(false);
    }
  }

  async function saveEdit(id: string) {
    setPending(true);
    const payload = new FormData();
    payload.set('title', draft.title);
    payload.set('description', draft.description);
    payload.set('category', draft.category);
    if (draft.file) payload.set('file', draft.file);

    try {
      const response = await fetch(`/api/admin/videos/${id}`, { method: 'PATCH', body: payload });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not update video');
        return;
      }
      onChange(videos.map((video) => (video.id === id ? data : video)));
      setEditing(null);
      onMessage('Video updated.');
    } catch {
      onMessage('Could not update video');
    } finally {
      setPending(false);
    }
  }

  async function removeVideo(id: string) {
    if (!window.confirm('Delete this video from the portfolio?')) return;
    setPending(true);
    try {
      const response = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not delete video');
        return;
      }
      onChange(data.videos);
      onMessage('Video deleted.');
    } catch {
      onMessage('Could not delete video');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-intro">
        <h2>Portfolio videos</h2>
        <p>Add, rename, recategorize, or replace clips. Names and descriptions show when someone opens a video.</p>
      </div>

      <form className="admin-card admin-form" onSubmit={addVideo}>
        <h3>Add a video</h3>
        <label className="admin-field">
          <span>Name</span>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </label>
        <label className="admin-field">
          <span>Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </label>
        <div className="admin-field">
          <span id="admin-add-category">Category</span>
          <AdminSelect
            labelledBy="admin-add-category"
            value={form.category}
            options={CATEGORY_OPTIONS}
            onChange={(value) => setForm((current) => ({ ...current, category: value as CategorySlug }))}
          />
        </div>
        <div className="admin-field">
          <span>MP4 file (under 25 MB)</span>
          <AdminFileField
            accept="video/mp4"
            fileName={form.file?.name}
            onChange={(file) => setForm((current) => ({ ...current, file }))}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Uploading…' : 'Add video'}
        </button>
      </form>

      <div className="admin-chip-row" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`admin-chip${category === 'all' ? ' admin-chip--active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {CATEGORIES.map((item) => (
          <button
            key={item.slug}
            type="button"
            className={`admin-chip${category === item.slug ? ' admin-chip--active' : ''}`}
            onClick={() => setCategory(item.slug)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="admin-video-list">
        {visible.map((video) => (
          <li key={video.id} className="admin-card admin-video-card">
            <video src={video.src} muted playsInline preload="metadata" />
            {editing === video.id ? (
              <div className="admin-form">
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                />
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                />
                <AdminSelect
                  value={draft.category}
                  options={CATEGORY_OPTIONS}
                  onChange={(value) => setDraft((current) => ({ ...current, category: value as CategorySlug }))}
                />
                <AdminFileField
                  accept="video/mp4"
                  fileName={draft.file?.name}
                  onChange={(file) => setDraft((current) => ({ ...current, file }))}
                  label="Replace video"
                />
                <div className="admin-row">
                  <button type="button" className="btn-primary" disabled={pending} onClick={() => saveEdit(video.id)}>
                    Save
                  </button>
                  <button type="button" className="admin-text-btn" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="admin-kicker">{categoryLabel(video.category)}</p>
                <strong>{video.title}</strong>
                {video.description ? <p>{video.description}</p> : <p className="admin-muted">No description yet.</p>}
                <div className="admin-row">
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() => {
                      setEditing(video.id);
                      setDraft({
                        title: video.title,
                        description: video.description,
                        category: video.category,
                        file: null,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="admin-text-btn admin-text-btn--danger" onClick={() => removeVideo(video.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
