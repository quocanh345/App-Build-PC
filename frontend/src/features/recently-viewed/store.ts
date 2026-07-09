import type { ProductTypeKey } from '../products/product-types';

const STORAGE_KEY = 'apppc.recently-viewed';
const MAX_ITEMS = 10;

export interface RecentlyViewedEntry {
  typeKey: ProductTypeKey;
  productId: string;
}

export function getRecentlyViewed(): RecentlyViewedEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyViewedEntry[];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(typeKey: ProductTypeKey, productId: string) {
  const current = getRecentlyViewed();
  const withoutCurrent = current.filter(
    (entry) => !(entry.typeKey === typeKey && entry.productId === productId),
  );
  const next = [{ typeKey, productId }, ...withoutCurrent].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
