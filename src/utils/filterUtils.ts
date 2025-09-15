import type { ExpressionSpecification } from 'maplibre-gl';

export const createAltitudeFilter = (
  baseProp: string,
  topProp: string,
  minAltitude: number,
  maxAltitude: number,
): ExpressionSpecification => {
  return [
    'all',
    ['<=', ['coalesce', ['get', baseProp], ['get', topProp], 0], maxAltitude],
    ['>=', ['coalesce', ['get', topProp], ['get', baseProp], 0], minAltitude],
  ];
};
