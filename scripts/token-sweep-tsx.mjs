import fs from 'node:fs';

const files = [
  'components/portfolio/VideoLightbox.tsx',
  'components/home/Services.tsx',
  'components/home/ClientResults.tsx',
  'components/home/OurTeam.tsx',
  'components/home/HowWeWork.tsx',
  'components/home/SocialMarquee.tsx',
];

const map = [
  [/bg-\[#E8E3DC\]/g, 'bg-bg-surface'],
  [/bg-\[#EFEBE5\]/g, 'bg-bg-base'],
  [/fill="#EFEBE5"/g, 'fill="var(--bg-base)"'],
  [/fill="#000000"/g, 'fill="var(--text-primary)"'],
  [/text-\[#000000\]/g, 'text-text-primary'],
  [/hover:bg-white\/20/g, 'hover:bg-text-inverse/20'],
  [/hover:bg-white\/25/g, 'hover:bg-text-inverse/25'],
  [/bg-white\/10/g, 'bg-text-inverse/10'],
  [/bg-white\/12/g, 'bg-text-inverse/12'],
  [/bg-white\/15/g, 'bg-text-inverse/15'],
  [/bg-white\/20/g, 'bg-text-inverse/20'],
  [/bg-white\/25/g, 'bg-text-inverse/25'],
  [/bg-white\/90/g, 'bg-text-inverse/90'],
  [/text-white\/50/g, 'text-text-inverse/50'],
  [/text-white\/60/g, 'text-text-inverse/60'],
  [/text-white\/70/g, 'text-text-inverse/70'],
  [/text-white\/80/g, 'text-text-inverse/80'],
  [/text-white\/90/g, 'text-text-inverse/90'],
  [/outline-white/g, 'outline-text-inverse'],
  [/\bbg-white\b/g, 'bg-text-inverse'],
  [/\btext-white\b/g, 'text-text-inverse'],
  [/\btext-black\b/g, 'text-text-primary'],
  [/\bbg-black\b/g, 'bg-text-primary'],
];

for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  const before = source;
  for (const [re, to] of map) source = source.replace(re, to);

  if (file.includes('VideoLightbox')) {
    // Keep #08080B / rgba(8,8,11) exact — no semantic token matches.
  }

  if (file.includes('SocialMarquee')) {
    source = source.replace(
      /const ICON_FILL = 'rgb\(0, 0, 0\)';/,
      "const ICON_FILL = 'var(--text-primary)';"
    );
    source = source.replace(
      /background: 'rgba\(0,0,0,0\.04\)'/,
      "background: 'color-mix(in srgb, var(--text-primary) 4%, transparent)'"
    );
    source = source.replace(
      /rgba\(0,0,0,0\)/g,
      'transparent'
    );
    source = source.replace(
      /rgb\(0,0,0\)/g,
      'var(--text-primary)'
    );
  }

  if (file.includes('HowWeWork')) {
    source = source.replace(
      /stopColor="rgba\(0, 0, 0, 0\)"/g,
      'stopColor="transparent"'
    );
    source = source.replace(
      /stopColor="rgba\(0, 0, 0, 0\.55\)"/g,
      'stopColor="color-mix(in srgb, var(--text-primary) 55%, transparent)"'
    );
    source = source.replace(
      /stroke="rgba\(0, 0, 0, 0\.07\)"/g,
      'stroke="color-mix(in srgb, var(--text-primary) 7%, transparent)"'
    );
    source = source.replace(
      /stroke="rgba\(0, 0, 0, 0\.12\)"/g,
      'stroke="color-mix(in srgb, var(--text-primary) 12%, transparent)"'
    );
  }

  if (source !== before) {
    fs.writeFileSync(file, source);
    console.log('updated', file);
  } else {
    console.log('unchanged', file);
  }
}

// PortfolioLookbook — replace non-purple colours only
const lookbook = 'app/portfolio/PortfolioLookbook.tsx';
let lb = fs.readFileSync(lookbook, 'utf8');
const lbBefore = lb;
const lbMap = [
  [/bg-\[#EFEBE5\]/g, 'bg-bg-base'],
  [/bg-\[#E8E3DC\]/g, 'bg-bg-surface'],
  [/border-\[#E8E3DC\]/g, 'border-bg-surface'],
  [/text-\[#000000\]/g, 'text-text-primary'],
  [/text-\[rgba\(0,0,0,0\.48\)\]/g, 'text-text-muted'],
  [/color: "#000000"/g, 'color: "var(--text-primary)"'],
  [/color: '#ffffff'/g, 'color: "var(--text-inverse)"'],
  [/color: "rgba\(0, 0, 0, 0\.48\)"/g, 'color: "var(--text-muted)"'],
  [/border: "1px solid rgba\(0,0,0,0\.2\)"/g, 'border: "1px solid color-mix(in srgb, var(--text-primary) 20%, transparent)"'],
  [/bg-\[rgba\(0,0,0,0\.1\)\]/g, 'bg-text-primary/10'],
  [/border-\[rgba\(0,0,0,0\.1\)\]/g, 'border-text-primary/10'],
  [/\bbg-white\b/g, 'bg-text-inverse'],
  [/\btext-white\b/g, 'text-text-inverse'],
  [/\bbg-black\b/g, 'bg-text-primary'],
];
for (const [re, to] of lbMap) lb = lb.replace(re, to);
// Do NOT touch #7C5CFF or rgba(124,92,255,*)
if (lb !== lbBefore) {
  fs.writeFileSync(lookbook, lb);
  console.log('updated', lookbook, '(purple left untouched)');
}
