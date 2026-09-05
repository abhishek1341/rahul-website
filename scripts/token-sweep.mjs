import fs from 'node:fs';

const path = 'app/globals.css';
let css = fs.readFileSync(path, 'utf8');
const start = css.indexOf('html {');
const head = css.slice(0, start);
let body = css.slice(start);

const alphaBlack = [0.06, 0.1, 0.12, 0.3, 0.35, 0.4, 0.45, 0.55, 0.72];
for (const a of alphaBlack) {
  const re = new RegExp(
    String.raw`rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*${a}\s*\)`,
    'g'
  );
  const pct = Math.round(a * 100);
  body = body.replace(
    re,
    `color-mix(in srgb, var(--text-primary) ${pct}%, transparent)`
  );
}

const alphaWhite = [0.28, 0.3, 0.55, 0.85];
for (const a of alphaWhite) {
  const re = new RegExp(
    String.raw`rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*${a}\s*\)`,
    'g'
  );
  const pct = Math.round(a * 100);
  body = body.replace(
    re,
    `color-mix(in srgb, var(--text-inverse) ${pct}%, transparent)`
  );
}

body = body.replace(/rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/g, 'var(--text-primary)');
// #050505 has no exact semantic match — leave literal for pixel-identical intro.

fs.writeFileSync(path, head + body);
console.log('globals.css alpha sweep done');
