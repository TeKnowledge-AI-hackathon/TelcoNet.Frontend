export const THEMES = [
  { name: 'MTN (Default)', bg: '#0d1117', accent: '#ffcc00' },
  { name: 'Dark', bg: '#0d1117', accent: '#3b82f6' },
  { name: 'Midnight', bg: '#020617', accent: '#8b5cf6' },
  { name: 'Slate', bg: '#0f172a', accent: '#2dd4bf' },
  { name: 'Carbon', bg: '#161616', accent: '#f59e0b' },
];

export const applyTheme = (themeIndex) => {
  const theme = THEMES[themeIndex];
  const surfaceColors = ['#161b22', '#161b22', '#0f172a', '#1e293b', '#262626'];
  const hoverColors = ['#1c2128', '#1c2128', '#1e293b', '#334155', '#404040'];
  const borderColors = ['#30363d', '#30363d', '#1e293b', '#334155', '#404040'];

  const root = document.documentElement;
  root.style.setProperty('--bg-color', theme.bg);
  root.style.setProperty('--surface-color', surfaceColors[themeIndex]);
  root.style.setProperty('--surface-hover', hoverColors[themeIndex]);
  root.style.setProperty('--border-color', borderColors[themeIndex]);
  root.style.setProperty('--accent-color', theme.accent);

  let styleTag = document.getElementById('dynamic-theme');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'dynamic-theme';
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
    .bg-\\[\\#0d1117\\], [style*="background: #0d1117"], [style*="background:#0d1117"] { background-color: var(--bg-color) !important; }
    .bg-\\[\\#161b22\\], [style*="background: #161b22"], [style*="background:#161b22"] { background-color: var(--surface-color) !important; }
    .bg-\\[\\#1c2128\\], [style*="background: #1c2128"], [style*="background:#1c2128"], .hover\\:bg-\\[\\#1c2128\\]:hover { background-color: var(--surface-hover) !important; }
    .border-\\[\\#30363d\\], [style*="border: 1px solid #30363d"], [style*="borderColor: #30363d"], [style*="border-color: #30363d"] { border-color: var(--border-color) !important; }
    .text-\\[\\#3b82f6\\], [style*="color: #3b82f6"] { color: var(--accent-color) !important; }
    .text-\\[\\#2dd4bf\\], [style*="color: #2dd4bf"] { color: var(--accent-color) !important; }
    .bg-\\[\\#3b82f6\\], [style*="background: #3b82f6"], [style*="background:#3b82f6"] { background-color: var(--accent-color) !important; }
    .border-\\[\\#3b82f6\\], [style*="border-color: #3b82f6"], .focus\\:border-\\[\\#3b82f6\\]:focus { border-color: var(--accent-color) !important; }
    .glow-teal { box-shadow: 0 0 15px var(--accent-color) !important; }
    .glow-blue { box-shadow: 0 0 15px var(--accent-color) !important; }
    stop[stopColor="#3b82f6"] { stop-color: var(--accent-color) !important; }
    [stroke="#3b82f6"] { stroke: var(--accent-color) !important; }
    [fill="#3b82f6"] { fill: var(--accent-color) !important; }
  `;
};
