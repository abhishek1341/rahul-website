import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shouldBypassImageOptimizer } from './image-src';

test('bypasses the Next image optimizer for admin uploads', () => {
  assert.equal(
    shouldBypassImageOptimizer('/uploads/logos/logo-mu8cseyq-52zlss.png'),
    true,
  );
  assert.equal(shouldBypassImageOptimizer('/uploads/videos/clip-1.mp4'), true);
});

test('keeps optimization for bundled public assets', () => {
  assert.equal(shouldBypassImageOptimizer('/client-logos/1.png'), false);
  assert.equal(shouldBypassImageOptimizer('/brand/suntrix-logo.png'), false);
  assert.equal(shouldBypassImageOptimizer('/team_photo.png'), false);
});
