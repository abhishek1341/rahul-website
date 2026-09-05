import fs from 'node:fs';

// Pixel-identical only where a semantic token's value equals the hex.
// Remaining one-offs stay literal and are listed in the report.
const path = 'app/portfolio/PortfolioLookbook.tsx';
let s = fs.readFileSync(path, 'utf8');

s = s.replace(/color: isSelected \? "#000000" : "rgba\(0, 0, 0, 0\.48\)"/g,
  'color: isSelected ? "var(--text-primary)" : "var(--text-muted)"');

// Near-black phone chrome → brand-ink (values differ: #111 vs #0D0A08).
// Leave #111111 / #111 / #999 / cream orphans literal for pixel-identical.

fs.writeFileSync(path, s);
console.log('lookbook exact-match cleanup done');
