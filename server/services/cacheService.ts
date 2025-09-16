import type { FeatureCollection } from 'geojson';
import { CACHE_TTL } from '../config/index.js';

interface CacheEntry {
  data: FeatureCollection;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export const getFromCache = (key: string): FeatureCollection | null => {
  const cachedData = cache.get(key);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data;
  }

  return null;
};

export const setToCache = (key: string, data: FeatureCollection): void => {
  const dataToCache: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  cache.set(key, dataToCache);
};
