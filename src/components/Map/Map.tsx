import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { Box } from '@mui/material';

import 'maplibre-gl/dist/maplibre-gl.css';

import { MAPTILER_API_KEY } from '@/config';

export const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      center: [0, 0],
      zoom: 2,
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return <Box ref={mapContainer} sx={{ width: '100%', height: '100vh' }} />;
};
