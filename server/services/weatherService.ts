import axios from 'axios';
import type { FeatureCollection } from 'geojson';
import { AWC_API_BASE_URL } from '../config/index.js';

export const fetchWeatherData = async (
  endpoint: 'isigmet' | 'airsigmet',
): Promise<FeatureCollection> => {
  const response = await axios.get<FeatureCollection>(
    `${AWC_API_BASE_URL}/${endpoint}`,
    {
      params: { format: 'geojson' },
    },
  );
  return response.data;
};
