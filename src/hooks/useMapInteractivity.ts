import { useEffect, useRef } from 'react';
import {
  Map as MaplibreMap,
  Popup as MaplibrePopup,
  type MapMouseEvent,
} from 'maplibre-gl';
import { createPopupMarkup } from '@/utils/popupUtils';

export const useMapInteractivity = (
  mapRef: React.RefObject<MaplibreMap | null>,
  isMapLoaded: boolean,
) => {
  const popupRef = useRef(
    new MaplibrePopup({
      closeButton: true,
      maxWidth: '400px',
      closeOnClick: false,
    }),
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const interactiveLayers = ['sigmet-layer', 'airsigmet-layer'];

    const handleMapClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: interactiveLayers,
      });

      if (features.length > 0) {
        const feature = features[0];
        const properties = feature.properties;
        const type =
          feature.layer.id === 'sigmet-layer' ? 'SIGMET' : 'AIRSIGMET';

        const description = createPopupMarkup(properties, type);

        popupRef.current.setLngLat(e.lngLat).setHTML(description).addTo(map);
      } else {
        popupRef.current.remove();
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', handleMapClick);
    map.on('mouseenter', interactiveLayers, handleMouseEnter);
    map.on('mouseleave', interactiveLayers, handleMouseLeave);

    const currentPopup = popupRef.current;
    return () => {
      if (map.getStyle()) {
        currentPopup.remove();
        map.off('click', handleMapClick);
        map.off('mouseenter', interactiveLayers, handleMouseEnter);
        map.off('mouseleave', interactiveLayers, handleMouseLeave);
      }
    };
  }, [mapRef, isMapLoaded]);
};
