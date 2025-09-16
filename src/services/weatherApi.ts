import type { FeatureCollection } from 'geojson';
import apiClient from './apiClient';

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
