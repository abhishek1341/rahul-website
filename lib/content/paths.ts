import os from 'os';
import path from 'path';

export function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

export function persistentRoot(): string {
  if (process.env.SUNTRIX_DATA_DIR) return process.env.SUNTRIX_DATA_DIR;
  return path.join(os.homedir(), '.suntrix-media');
}

export function localContentPath(): string {
  if (process.env.SUNTRIX_LOCAL_CONTENT) return process.env.SUNTRIX_LOCAL_CONTENT;
  return path.join(process.cwd(), 'data', 'site-content.json');
}

export function persistentContentPath(): string {
  return path.join(persistentRoot(), 'site-content.json');
}

export function contentFilePaths(): string[] {
  return [...new Set([persistentContentPath(), localContentPath()].map((file) => path.resolve(file)))];
}

export function persistentUploadsRoot(): string {
  return path.join(persistentRoot(), 'uploads');
}

export function publicUploadsRoot(): string {
  return path.join(process.cwd(), 'public', 'uploads');
}

export function uploadDirCandidates(): string[] {
  return [...new Set([persistentUploadsRoot(), publicUploadsRoot()].map((dir) => path.resolve(dir)))];
}

export function backupsDir(): string {
  return path.join(persistentRoot(), 'backups');
}
