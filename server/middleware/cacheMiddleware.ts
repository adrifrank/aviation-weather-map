import type { Request, Response, NextFunction } from 'express';
import type { FeatureCollection } from 'geojson';

interface CacheEntry {
  data: FeatureCollection;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.path;
  const cachedData = cache.get(key);

  if (cachedData && Date.now() - cachedData.timestamp < 3600000) {
    console.log(`[Cache] HIT for ${key}`);
    return res.json(cachedData.data);
  }

  console.log(`[Cache] MISS for ${key}`);
  res.locals.cache = cache;
  next();
};
