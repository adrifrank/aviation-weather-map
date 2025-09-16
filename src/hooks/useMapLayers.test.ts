import { renderHook } from '@testing-library/react';
import { useMapLayers } from './useMapLayers';
import { jest } from '@jest/globals';
import type { FeatureCollection } from 'geojson';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { COLORS } from '@/styles/themeConstants';

const createMockMap = () => ({
  addSource: jest.fn(),
  addLayer: jest.fn(),
  getSource: jest.fn().mockReturnValue(undefined),
  isStyleLoaded: jest.fn().mockReturnValue(true),
  setData: jest.fn(),
});

const mockSigmetData: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
      properties: { id: 'sigmet-1' },
    },
  ],
};

const mockAirsigmetData: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2, 2],
            [3, 2],
            [3, 3],
            [2, 3],
            [2, 2],
          ],
        ],
      },
      properties: { id: 'airsigmet-1' },
    },
  ],
};

describe('useMapLayers', () => {
  it('should add sources and layers if they do not exist', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, true, mockSigmetData, mockAirsigmetData),
    );

    expect(mockMap.addSource).toHaveBeenCalledTimes(2);
    expect(mockMap.addLayer).toHaveBeenCalledTimes(2);

    expect(mockMap.addSource).toHaveBeenCalledWith('sigmet-source', {
      type: 'geojson',
      data: mockSigmetData,
    });
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sigmet-layer',
        source: 'sigmet-source',
      }),
    );
  });

  it('should only update data if sources already exist', () => {
    const mockSetData = jest.fn();
    const mockMap = {
      ...createMockMap(),
      getSource: jest.fn().mockReturnValue({
        setData: mockSetData,
      }),
    };
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, true, mockSigmetData, mockAirsigmetData),
    );

    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();

    expect(mockSetData).toHaveBeenCalledTimes(2);
    expect(mockSetData).toHaveBeenCalledWith(mockSigmetData);
    expect(mockSetData).toHaveBeenCalledWith(mockAirsigmetData);
  });

  it('should not execute if map is not loaded', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, false, mockSigmetData, mockAirsigmetData),
    );

    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();
  });

  it('should not execute if map ref is null', () => {
    const mapRef = { current: null };

    renderHook(() =>
      useMapLayers(mapRef, true, mockSigmetData, mockAirsigmetData),
    );
  });

  it('should not execute if sigmetData is null', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapLayers(mapRef, true, null, mockAirsigmetData));

    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();
  });

  it('should not execute if airsigmetData is null', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapLayers(mapRef, true, mockSigmetData, null));

    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();
  });

  it('should create layers with correct layer properties', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, true, mockSigmetData, mockAirsigmetData),
    );

    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sigmet-layer',
        source: 'sigmet-source',
        type: 'fill',
        paint: {
          'fill-color': COLORS.SIGMET,
          'fill-opacity': 0.4,
          'fill-outline-color': COLORS.SIGMET,
        },
      }),
    );

    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'airsigmet-layer',
        source: 'airsigmet-source',
        type: 'fill',
        paint: {
          'fill-color': COLORS.AIRSIGMET,
          'fill-opacity': 0.4,
          'fill-outline-color': COLORS.AIRSIGMET,
        },
      }),
    );
  });

  it('should handle mixed source states (one exists, one does not)', () => {
    const mockSetData = jest.fn();
    const mockMap = {
      ...createMockMap(),
      getSource: jest.fn().mockImplementation((sourceId: unknown) => {
        if (sourceId === 'sigmet-source') {
          return { setData: mockSetData };
        }
        return undefined;
      }),
    };
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, true, mockSigmetData, mockAirsigmetData),
    );

    expect(mockSetData).toHaveBeenCalledWith(mockSigmetData);

    expect(mockMap.addSource).toHaveBeenCalledWith('airsigmet-source', {
      type: 'geojson',
      data: mockAirsigmetData,
    });
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'airsigmet-layer',
        source: 'airsigmet-source',
      }),
    );
  });

  it('should re-run when dependencies change', () => {
    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    const { rerender } = renderHook(
      ({ sigmetData, airsigmetData }) =>
        useMapLayers(mapRef, true, sigmetData, airsigmetData),
      {
        initialProps: {
          sigmetData: mockSigmetData,
          airsigmetData: mockAirsigmetData,
        },
      },
    );

    expect(mockMap.addSource).toHaveBeenCalledTimes(2);

    mockMap.addSource.mockClear();
    mockMap.addLayer.mockClear();

    rerender({
      sigmetData: mockSigmetData,
      airsigmetData: mockAirsigmetData,
    });

    expect(mockMap.addSource).not.toHaveBeenCalled();
    expect(mockMap.addLayer).not.toHaveBeenCalled();
  });

  it('should handle empty feature collections', () => {
    const emptySigmetData: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const emptyAirsigmetData: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    const mockMap = createMockMap();
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() =>
      useMapLayers(mapRef, true, emptySigmetData, emptyAirsigmetData),
    );

    expect(mockMap.addSource).toHaveBeenCalledWith('sigmet-source', {
      type: 'geojson',
      data: emptySigmetData,
    });
    expect(mockMap.addSource).toHaveBeenCalledWith('airsigmet-source', {
      type: 'geojson',
      data: emptyAirsigmetData,
    });
  });
});
