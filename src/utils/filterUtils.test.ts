import { createAltitudeFilter } from './filterUtils';
import type { ExpressionSpecification } from 'maplibre-gl';

describe('createAltitudeFilter', () => {
  it('should create a correct filter expression', () => {
    const filter = createAltitudeFilter('base', 'top', 10000, 20000);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 20000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 10000],
    ]);
  });

  it('should handle different property names', () => {
    const filter = createAltitudeFilter(
      'altitudeHi1',
      'altitudeHi2',
      5000,
      15000,
    );

    expect(filter).toEqual([
      'all',
      [
        '<=',
        ['coalesce', ['get', 'altitudeHi1'], ['get', 'altitudeHi2'], 0],
        15000,
      ],
      [
        '>=',
        ['coalesce', ['get', 'altitudeHi2'], ['get', 'altitudeHi1'], 0],
        5000,
      ],
    ]);
  });

  it('should handle zero altitude values', () => {
    const filter = createAltitudeFilter('base', 'top', 0, 0);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 0],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 0],
    ]);
  });

  it('should handle maximum altitude values', () => {
    const filter = createAltitudeFilter('base', 'top', 48000, 48000);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 48000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 48000],
    ]);
  });

  it('should handle wide altitude ranges', () => {
    const filter = createAltitudeFilter('base', 'top', 0, 48000);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 48000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 0],
    ]);
  });

  it('should handle narrow altitude ranges', () => {
    const filter = createAltitudeFilter('base', 'top', 25000, 30000);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 30000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 25000],
    ]);
  });

  it('should handle same min and max altitude', () => {
    const filter = createAltitudeFilter('base', 'top', 15000, 15000);

    expect(filter).toEqual([
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 15000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 15000],
    ]);
  });

  it('should create valid MapLibre GL expression', () => {
    const filter = createAltitudeFilter('base', 'top', 10000, 20000);

    expect(Array.isArray(filter)).toBe(true);
    expect(filter[0]).toBe('all');
    expect(Array.isArray(filter[1])).toBe(true);
    expect(Array.isArray(filter[2])).toBe(true);
    expect((filter[1] as ExpressionSpecification)[0]).toBe('<=');
    expect((filter[2] as ExpressionSpecification)[0]).toBe('>=');
  });

  it('should use coalesce to handle missing properties', () => {
    const filter = createAltitudeFilter('base', 'top', 10000, 20000);

    const filterString = JSON.stringify(filter);
    expect(filterString).toContain('coalesce');
    expect(filterString).toContain('"base"');
    expect(filterString).toContain('"top"');
    expect(filterString).toContain('0');
  });

  it('should maintain property order in coalesce expressions', () => {
    const filter = createAltitudeFilter(
      'altitudeHi1',
      'altitudeHi2',
      1000,
      2000,
    );

    const filterString = JSON.stringify(filter);
    expect(filterString).toContain('altitudeHi1');
    expect(filterString).toContain('altitudeHi2');
    expect(filterString).toContain('coalesce');
  });
});
