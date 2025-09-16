import { asyncHandler } from '../utils/asyncHandler.js';
import { fetchWeatherData } from '../services/weatherService.js';
import { setToCache } from '../services/cacheService.js';

export const getSigmet = asyncHandler(async (req, res) => {
  const sigmetData = await fetchWeatherData('isigmet');

  setToCache(req.path, sigmetData);

  res.json(sigmetData);
});

export const getAirsigmet = asyncHandler(async (req, res) => {
  const airsigmetData = await fetchWeatherData('airsigmet');

  setToCache(req.path, airsigmetData);

  res.json(airsigmetData);
});
