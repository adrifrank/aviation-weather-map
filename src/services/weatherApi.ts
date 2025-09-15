import axios from 'axios';
import { AWC_API_BASE_URL } from '@/config';
import type { FeatureCollection } from 'geojson';

const apiClient = axios.create({
  baseURL: AWC_API_BASE_URL,
});

export const getSigmetData = async (): Promise<FeatureCollection> => {
  try {
    const response = await apiClient.get<FeatureCollection>('/isigmet');
    return response.data;
  } catch (error) {
    console.error('Error fetching SIGMET data:', error);
    return { type: 'FeatureCollection', features: [] };
  }
};

export const getAirsigmetData = async (): Promise<FeatureCollection> => {
  try {
    const response = await apiClient.get<FeatureCollection>('/airsigmet');
    return response.data;
  } catch (error) {
    console.error('Error fetching AIRSIGMET data:', error);
    return { type: 'FeatureCollection', features: [] };
  }
};
