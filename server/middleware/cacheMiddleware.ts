import type { Request, Response, NextFunction } from 'express';
import { getFromCache } from '../services/cacheService.js';

export const cacheMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const key = req.path;
  const cachedData = getFromCache(key);

  if (cachedData) {
    console.log(`[Cache] HIT for ${key}`);
    return res.json(cachedData);
  }

  console.log(`[Cache] MISS for ${key}`);
  next();
};
