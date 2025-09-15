import { useEffect } from 'react';
import type { Map as MaplibreMap, ExpressionSpecification } from 'maplibre-gl';
import { createAltitudeFilter } from '@/utils/filterUtils';

export const useMapFilters = (
  mapRef: React.RefObject<MaplibreMap | null>,
  isMapLoaded: boolean,
  visibleLayers: string[],
  altitudeRange: number[],
) => {
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    map.setLayoutProperty(
      'sigmet-layer',
      'visibility',
      visibleLayers.includes('sigmet') ? 'visible' : 'none',
    );
    map.setLayoutProperty(
      'airsigmet-layer',
      'visibility',
      visibleLayers.includes('airsigmet') ? 'visible' : 'none',
    );

    const [minAltitude, maxAltitude] = altitudeRange;

    const sigmetFilter: ExpressionSpecification = createAltitudeFilter(
      'base',
      'top',
      minAltitude,
      maxAltitude,
    );
    map.setFilter('sigmet-layer', sigmetFilter);

    const airsigmetFilter: ExpressionSpecification = createAltitudeFilter(
      'altitudeHi1',
      'altitudeHi2',
      minAltitude,
      maxAltitude,
    );
    map.setFilter('airsigmet-layer', airsigmetFilter);
  }, [mapRef, isMapLoaded, visibleLayers, altitudeRange]);
};
