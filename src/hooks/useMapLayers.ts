import { useEffect } from 'react';
import type { Map as MaplibreMap, GeoJSONSource } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { COLORS } from '@/styles/themeConstants';

const addOrUpdateLayer = (
  map: MaplibreMap,
  id: string,
  data: FeatureCollection,
  color: string,
) => {
  const source = map.getSource(`${id}-source`);
  if (source) {
    (source as GeoJSONSource).setData(data);
  } else {
    map.addSource(`${id}-source`, { type: 'geojson', data });
    map.addLayer({
      id: `${id}-layer`,
      source: `${id}-source`,
      type: 'fill',
      paint: {
        'fill-color': color,
        'fill-opacity': 0.4,
        'fill-outline-color': color,
      },
    });
  }
};

export const useMapLayers = (
  mapRef: React.RefObject<MaplibreMap | null>,
  isMapLoaded: boolean,
  sigmetData: FeatureCollection | null,
  airsigmetData: FeatureCollection | null,
) => {
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || !sigmetData || !airsigmetData) return;
    
    addOrUpdateLayer(map, 'sigmet', sigmetData, COLORS.SIGMET);
    addOrUpdateLayer(map, 'airsigmet', airsigmetData, COLORS.AIRSIGMET);
  }, [mapRef, isMapLoaded, sigmetData, airsigmetData]);
};
