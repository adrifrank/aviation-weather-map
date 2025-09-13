import { useEffect, useRef, useState } from 'react';
import { Map as MaplibreMap } from 'maplibre-gl';
import { MAPTILER_API_KEY } from '@/config';

export const useMapInitialization = (
  mapContainerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<MaplibreMap | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = new MaplibreMap({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      center: [0, 0],
      zoom: 2,
    });

    const currentMap = mapRef.current;

    currentMap.on('load', () => {
      setIsMapLoaded(true);
    });

    return () => {
      currentMap?.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, [mapContainerRef]);

  return { mapRef, isMapLoaded };
};
