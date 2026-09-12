'use client';

import { useState } from 'react';
import type { SiteLogo } from '@/lib/content/types';
import AdminFileField from './AdminFileField';

type LogosPanelProps = {
  logos: SiteLogo[];
  onChange: (logos: SiteLogo[]) => void;
  onMessage: (message: string) => void;
};

export default function LogosPanel({ logos, onChange, onMessage }: LogosPanelProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);

  async function addLogo(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      onMessage('Choose a logo image first.');
      return;
    }

    setPending(true);
    onMessage('');
    const form = new FormData();
    form.set('name', name);
    form.set('file', file);

    try {
      const response = await fetch('/api/admin/logos', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not add logo');
        return;
      }
      onChange([...logos, data]);
      setName('');
      setFile(null);
      onMessage('Logo added. It will show in the brand row on the site.');
    } catch {
      onMessage('Could not add logo');
    } finally {
      setPending(false);
    }
  }

  async function saveEdit(id: string) {
    setPending(true);
    const form = new FormData();
    form.set('name', editName);
    if (editFile) form.set('file', editFile);

    try {
      const response = await fetch(`/api/admin/logos/${id}`, { method: 'PATCH', body: form });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not update logo');
        return;
      }
      onChange(logos.map((logo) => (logo.id === id ? data : logo)));
      setEditing(null);
      setEditFile(null);
      onMessage('Logo updated.');
    } catch {
      onMessage('Could not update logo');
    } finally {
      setPending(false);
    }
  }

  async function removeLogo(id: string) {
    if (!window.confirm('Delete this logo from the website?')) return;
    setPending(true);
    try {
      const response = await fetch(`/api/admin/logos/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        onMessage(data.error || 'Could not delete logo');
        return;
      }
      onChange(data.logos);
      onMessage('Logo deleted.');
    } catch {
      onMessage('Could not delete logo');
    } finally {
      setPending(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= logos.length) return;
    const next = [...logos];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    onChange(next);
    await fetch('/api/admin/logos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: next.map((logo) => logo.id) }),
    });
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-intro">
        <h2>Brand logos</h2>
        <p>These appear in the scrolling brand row on Home and Portfolio.</p>
      </div>

      <form className="admin-card admin-form" onSubmit={addLogo}>
        <h3>Add a logo</h3>
        <label className="admin-field">
          <span>Brand name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Avara Coffee" />
        </label>
        <div className="admin-field">
          <span>Logo file</span>
          <AdminFileField
            accept="image/png,image/jpeg,image/webp"
            fileName={file?.name}
            onChange={setFile}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? 'Saving…' : 'Add logo'}
        </button>
      </form>

      <ul className="admin-logo-grid">
        {logos.map((logo, index) => (
          <li
            key={logo.id}
            className={`admin-logo-card${editing === logo.id ? ' admin-logo-card--editing' : ''}`}
          >
            <div className="admin-logo-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} />
            </div>

            {editing === logo.id ? (
              <div className="admin-form admin-form--compact">
                <label className="admin-field">
                  <span>Brand name</span>
                  <input value={editName} onChange={(event) => setEditName(event.target.value)} />
                </label>
                <div className="admin-field">
                  <span>Replace logo</span>
                  <AdminFileField
                    accept="image/png,image/jpeg,image/webp"
                    fileName={editFile?.name}
                    onChange={setEditFile}
                    label="Replace file"
                  />
                </div>
                <div className="admin-row">
                  <button type="button" className="btn-primary" disabled={pending} onClick={() => saveEdit(logo.id)}>
                    Save
                  </button>
                  <button type="button" className="admin-text-btn" onClick={() => setEditing(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <strong className="admin-logo-name">{logo.name}</strong>
                <div className="admin-row">
                  <button type="button" className="admin-text-btn" onClick={() => move(index, -1)} disabled={index === 0}>
                    Up
                  </button>
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() => move(index, 1)}
                    disabled={index === logos.length - 1}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="admin-text-btn"
                    onClick={() => {
                      setEditing(logo.id);
                      setEditName(logo.name);
                      setEditFile(null);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="admin-text-btn admin-text-btn--danger" onClick={() => removeLogo(logo.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
