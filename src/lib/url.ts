/**
 * Resolve um caminho interno respeitando o `base` do Astro
 * ("/" na Vercel, "/portfolio-bk" no GitHub Pages).
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}
