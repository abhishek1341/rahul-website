import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createSeedContent } from './seed';
import {
  readSiteContent,
  writeSiteContent,
} from './store';
import type { SiteContent } from './types';

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'suntrix-content-'));
}

function customized(seed: SiteContent): SiteContent {
  return {
    ...seed,
    logos: [
      ...seed.logos,
      {
        id: 'logo-custom-1',
        src: '/uploads/logos/logo-custom-1.png',
        name: 'sprite',
        alt: 'sprite logo',
      },
    ],
    videos: seed.videos.map((video, index) =>
      index === 0
        ? { ...video, title: 'Custom Coffee Title', description: 'Shot for Avara.' }
        : video,
    ),
  };
}

const originalEnv = {
  SUNTRIX_DATA_DIR: process.env.SUNTRIX_DATA_DIR,
  SUNTRIX_LOCAL_CONTENT: process.env.SUNTRIX_LOCAL_CONTENT,
  SUNTRIX_SKIP_UPLOAD_MIRROR: process.env.SUNTRIX_SKIP_UPLOAD_MIRROR,
  NEXT_PHASE: process.env.NEXT_PHASE,
};

let dir = '';

beforeEach(() => {
  dir = tempDir();
  process.env.SUNTRIX_DATA_DIR = dir;
  process.env.SUNTRIX_LOCAL_CONTENT = path.join(dir, 'local-site-content.json');
  process.env.SUNTRIX_SKIP_UPLOAD_MIRROR = '1';
  delete process.env.NEXT_PHASE;
});

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true });
  if (originalEnv.SUNTRIX_DATA_DIR === undefined) delete process.env.SUNTRIX_DATA_DIR;
  else process.env.SUNTRIX_DATA_DIR = originalEnv.SUNTRIX_DATA_DIR;
  if (originalEnv.SUNTRIX_LOCAL_CONTENT === undefined) delete process.env.SUNTRIX_LOCAL_CONTENT;
  else process.env.SUNTRIX_LOCAL_CONTENT = originalEnv.SUNTRIX_LOCAL_CONTENT;
  if (originalEnv.SUNTRIX_SKIP_UPLOAD_MIRROR === undefined) delete process.env.SUNTRIX_SKIP_UPLOAD_MIRROR;
  else process.env.SUNTRIX_SKIP_UPLOAD_MIRROR = originalEnv.SUNTRIX_SKIP_UPLOAD_MIRROR;
  if (originalEnv.NEXT_PHASE === undefined) delete process.env.NEXT_PHASE;
  else process.env.NEXT_PHASE = originalEnv.NEXT_PHASE;
});

test('keeps admin titles after the deploy copy of site-content.json is deleted', () => {
  const saved = writeSiteContent(customized(createSeedContent()));
  fs.unlinkSync(process.env.SUNTRIX_LOCAL_CONTENT!);

  const restored = readSiteContent();
  assert.equal(restored.videos[0]?.title, 'Custom Coffee Title');
  assert.equal(restored.videos[0]?.description, 'Shot for Avara.');
  assert.equal(
    restored.logos.some((logo) => logo.src === saved.logos.at(-1)?.src),
    true,
  );
});

test('does not overwrite admin content with seed during next build', () => {
  writeSiteContent(customized(createSeedContent()));
  const persistent = path.join(dir, 'site-content.json');
  const before = fs.readFileSync(persistent, 'utf8');

  process.env.NEXT_PHASE = 'phase-production-build';
  const duringBuild = readSiteContent();
  assert.equal(duringBuild.videos[0]?.title, 'Custom Coffee Title');
  assert.equal(fs.readFileSync(persistent, 'utf8'), before);
});

test('does not write a seed file during next build when nothing is on disk', () => {
  process.env.NEXT_PHASE = 'phase-production-build';
  readSiteContent();
  assert.equal(fs.existsSync(path.join(dir, 'site-content.json')), false);
  assert.equal(fs.existsSync(process.env.SUNTRIX_LOCAL_CONTENT!), false);
});

test('re-adds uploaded logos that still exist on disk after json is reset', () => {
  const logosDir = path.join(dir, 'uploads', 'logos');
  fs.mkdirSync(logosDir, { recursive: true });
  fs.writeFileSync(path.join(logosDir, 'logo-mu8cseyq-52zlss.png'), 'png');

  const restored = readSiteContent();
  const sprite = restored.logos.find((logo) => logo.src.endsWith('logo-mu8cseyq-52zlss.png'));
  assert.ok(sprite);
  assert.equal(sprite?.name.toLowerCase(), 'sprite');
});
