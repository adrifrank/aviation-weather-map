import { renderHook } from '@testing-library/react';
import { useMapFilters } from './useMapFilters';
import { jest } from '@jest/globals';
import type { Map as MaplibreMap } from 'maplibre-gl';

const createMockMap = () => ({
  setLayoutProperty: jest.fn(),
  setFilter: jest.fn(),
});

describe('useMapFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set visibility for visible layers', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapFilters(mapRef, true, ['sigmet', 'airsigmet'], [10000, 30000]),
    );

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'visible',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'visible',
    );
  });

  it('should set visibility to none for hidden layers', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, ['sigmet'], [10000, 30000]));

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'visible',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'none',
    );
  });

  it('should hide all layers when visibleLayers is empty', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, [], [10000, 30000]));

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'none',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'none',
    );
  });

  it('should set altitude filters for both layers', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapFilters(mapRef, true, ['sigmet', 'airsigmet'], [5000, 25000]),
    );

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 25000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 5000],
    ]);

    expect(mockMap.setFilter).toHaveBeenCalledWith('airsigmet-layer', [
      'all',
      [
        '<=',
        ['coalesce', ['get', 'altitudeHi1'], ['get', 'altitudeHi2'], 0],
        25000,
      ],
      [
        '>=',
        ['coalesce', ['get', 'altitudeHi2'], ['get', 'altitudeHi1'], 0],
        5000,
      ],
    ]);
  });

  it('should use different altitude properties for different layers', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapFilters(mapRef, true, ['sigmet', 'airsigmet'], [0, 48000]),
    );

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 48000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 0],
    ]);

    expect(mockMap.setFilter).toHaveBeenCalledWith('airsigmet-layer', [
      'all',
      [
        '<=',
        ['coalesce', ['get', 'altitudeHi1'], ['get', 'altitudeHi2'], 0],
        48000,
      ],
      [
        '>=',
        ['coalesce', ['get', 'altitudeHi2'], ['get', 'altitudeHi1'], 0],
        0,
      ],
    ]);
  });

  it('should not execute if map is not loaded', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, false, ['sigmet'], [10000, 30000]));

    expect(mockMap.setLayoutProperty).not.toHaveBeenCalled();
    expect(mockMap.setFilter).not.toHaveBeenCalled();
  });

  it('should not execute if map ref is null', () => {
    const mapRef = { current: null };

    renderHook(() => useMapFilters(mapRef, true, ['sigmet'], [10000, 30000]));
  });

  it('should handle edge case altitude ranges', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, ['sigmet'], [0, 0]));

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 0],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 0],
    ]);
  });

  it('should handle maximum altitude range', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, ['sigmet'], [48000, 48000]));

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 48000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 48000],
    ]);
  });

  it('should re-run when dependencies change', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    const { rerender } = renderHook(
      ({ visibleLayers, altitudeRange }) =>
        useMapFilters(mapRef, true, visibleLayers, altitudeRange),
      {
        initialProps: {
          visibleLayers: ['sigmet'],
          altitudeRange: [10000, 30000],
        },
      },
    );

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'visible',
    );

    mockMap.setLayoutProperty.mockClear();
    mockMap.setFilter.mockClear();

    rerender({
      visibleLayers: ['airsigmet'],
      altitudeRange: [10000, 30000],
    });

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'none',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'visible',
    );
  });

  it('should update filters when altitude range changes', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    const { rerender } = renderHook(
      ({ altitudeRange }) =>
        useMapFilters(mapRef, true, ['sigmet'], altitudeRange),
      {
        initialProps: {
          altitudeRange: [10000, 30000],
        },
      },
    );

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 30000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 10000],
    ]);

    mockMap.setFilter.mockClear();

    rerender({
      altitudeRange: [5000, 40000],
    });

    expect(mockMap.setFilter).toHaveBeenCalledWith('sigmet-layer', [
      'all',
      ['<=', ['coalesce', ['get', 'base'], ['get', 'top'], 0], 40000],
      ['>=', ['coalesce', ['get', 'top'], ['get', 'base'], 0], 5000],
    ]);
  });

  it('should handle single layer visibility correctly', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, ['sigmet'], [10000, 30000]));

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'visible',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'none',
    );

    mockMap.setLayoutProperty.mockClear();

    renderHook(() =>
      useMapFilters(mapRef, true, ['airsigmet'], [10000, 30000]),
    );

    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'sigmet-layer',
      'visibility',
      'none',
    );
    expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
      'airsigmet-layer',
      'visibility',
      'visible',
    );
  });

  it('should call setFilter even when layers are hidden', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapFilters(mapRef, true, [], [10000, 30000]));

    expect(mockMap.setFilter).toHaveBeenCalledWith(
      'sigmet-layer',
      expect.any(Array),
    );
    expect(mockMap.setFilter).toHaveBeenCalledWith(
      'airsigmet-layer',
      expect.any(Array),
    );
  });
});
