const SITE_URL = "https://dallascircle.com";

/**
 * Stable place identity is derived from the immutable database UUID.
 * Public profile URLs remain slug-based and are intentionally separate.
 */
export function placeEntityId(placeId: string): string {
  return `${SITE_URL}/id/place/${placeId}`;
}
