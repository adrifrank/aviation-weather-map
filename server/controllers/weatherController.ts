import axios from 'axios';
import type { Request, Response } from 'express';
import type { FeatureCollection } from 'geojson';

const AWC_API_BASE_URL = 'https://aviationweather.gov/api/data';

export const getSigmet = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<FeatureCollection>(`${AWC_API_BASE_URL}/isigmet`, {
      params: { format: 'geojson' },
    });

    const { cache } = res.locals;
    const dataToCache = {
      data: response.data,
      timestamp: Date.now(),
    };
    cache.set(req.path, dataToCache);

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching SIGMET data:`, (error as Error).message);
    res.status(500).json({ message: `Error fetching SIGMET data` });
  }
};

export const getAirsigmet = async (req: Request, res: Response) => {
  try {
    const response = await axios.get<FeatureCollection>(`${AWC_API_BASE_URL}/airsigmet`, {
      params: { format: 'geojson' },
    });

    const { cache } = res.locals;
    const dataToCache = {
      data: response.data,
      timestamp: Date.now(),
    };
    cache.set(req.path, dataToCache);

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching AIRSIGMET data:`, (error as Error).message);
    res.status(500).json({ message: `Error fetching AIRSIGMET data` });
  }
};
