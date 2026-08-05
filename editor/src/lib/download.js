// Stažení exportovaného skinu. Text posledního exportu se drží i na window —
// e2e test si ho přečte bez zachytávání downloadu.
export function downloadSkin(name, text) {
  window.__kbLastExport = text;
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safe = (name || 'skin').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'skin';
  a.download = `${safe}.kb-skin.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
