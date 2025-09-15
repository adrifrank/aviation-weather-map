import { useRef } from 'react';
import { Box } from '@mui/material';
import type { FeatureCollection } from 'geojson';

import 'maplibre-gl/dist/maplibre-gl.css';

import {
  useMapInitialization,
  useMapLayers,
  useMapInteractivity,
  useMapFilters,
} from '@/hooks';

interface MapProps {
  sigmetData: FeatureCollection | null;
  airsigmetData: FeatureCollection | null;
  visibleLayers: string[];
  altitudeRange: number[];
}

export const Map = ({ sigmetData, airsigmetData, visibleLayers, altitudeRange }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { mapRef, isMapLoaded } = useMapInitialization(mapContainer);

  useMapLayers(mapRef, isMapLoaded, sigmetData, airsigmetData);
  useMapInteractivity(mapRef, isMapLoaded);
  useMapFilters(mapRef, isMapLoaded, visibleLayers, altitudeRange);

  return <Box ref={mapContainer} sx={{ width: '100%', height: '100vh' }} />;
};
