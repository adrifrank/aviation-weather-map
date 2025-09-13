import { useRef } from 'react';
import { Box } from '@mui/material';
import type { FeatureCollection } from 'geojson';

import 'maplibre-gl/dist/maplibre-gl.css';

import {
  useMapInitialization,
  useMapLayers,
  useMapInteractivity,
} from '@/hooks';

interface MapProps {
  sigmetData: FeatureCollection | null;
  airsigmetData: FeatureCollection | null;
}

export const Map = ({ sigmetData, airsigmetData }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const { mapRef, isMapLoaded } = useMapInitialization(mapContainer);

  useMapLayers(mapRef, isMapLoaded, sigmetData, airsigmetData);
  useMapInteractivity(mapRef, isMapLoaded);

  return <Box ref={mapContainer} sx={{ width: '100%', height: '100vh' }} />;
};
