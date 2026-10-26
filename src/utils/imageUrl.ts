export function formatImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Automatically convert GitHub blob URLs to direct raw asset URLs
  if (trimmed.includes('github.com') && trimmed.includes('/blob/')) {
    return trimmed
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }

  return trimmed;
}
