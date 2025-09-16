import { renderHook, act } from '@testing-library/react';
import { useMapInitialization } from './useMapInitialization';
import { jest } from '@jest/globals';
import { Map as MaplibreMap } from 'maplibre-gl';

jest.mock('@/config', () => ({
  MAPTILER_API_KEY: 'test-api-key',
}));

jest.mock('maplibre-gl', () => ({
  Map: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('useMapInitialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize map when container ref is available', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const { result } = renderHook(() => useMapInitialization(mapContainerRef));

    expect(MaplibreMap).toHaveBeenCalledWith({
      container: mockContainer,
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=test-api-key',
      center: [0, 0],
      zoom: 2,
    });

    expect(result.current.mapRef.current).toBeDefined();
    expect(result.current.isMapLoaded).toBe(false);
  });

  it('should not initialize map when container ref is null', () => {
    const mapContainerRef = { current: null };

    renderHook(() => useMapInitialization(mapContainerRef));

    expect(MaplibreMap).not.toHaveBeenCalled();
  });

  it('should not initialize map when map already exists', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const { result, rerender } = renderHook(() =>
      useMapInitialization(mapContainerRef),
    );
   
    expect(MaplibreMap).toHaveBeenCalledTimes(1);

    (MaplibreMap as jest.Mock).mockClear();

    rerender();
    expect(MaplibreMap).not.toHaveBeenCalled();

    expect(result.current.mapRef.current).toBeDefined();
  });

  it('should set isMapLoaded to true when map loads', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const mockMap = {
      on: jest.fn(),
      remove: jest.fn(),
    };
    (MaplibreMap as jest.Mock).mockReturnValue(mockMap);

    const { result } = renderHook(() => useMapInitialization(mapContainerRef));

    expect(result.current.isMapLoaded).toBe(false);

    const loadHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'load',
    )?.[1] as (() => void) | undefined;

    if (loadHandler) {
      act(() => {
        loadHandler();
      });
    }

    expect(result.current.isMapLoaded).toBe(true);
  });

  it('should clean up map on unmount', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const mockMap = {
      on: jest.fn(),
      remove: jest.fn(),
    };
    (MaplibreMap as jest.Mock).mockReturnValue(mockMap);

    const { unmount } = renderHook(() => useMapInitialization(mapContainerRef));

    expect(mockMap.remove).not.toHaveBeenCalled();

    unmount();

    expect(mockMap.remove).toHaveBeenCalled();
  });

  it('should reset state on cleanup', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const mockMap = {
      on: jest.fn(),
      remove: jest.fn(),
    };
    (MaplibreMap as jest.Mock).mockReturnValue(mockMap);

    const { result, unmount } = renderHook(() =>
      useMapInitialization(mapContainerRef),
    );

    const loadHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'load',
    )?.[1] as (() => void) | undefined;

    if (loadHandler) {
      act(() => {
        loadHandler();
      });
    }

    expect(result.current.isMapLoaded).toBe(true);
    expect(result.current.mapRef.current).toBeDefined();

    unmount();
  });

  it('should use correct MapTiler configuration', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    renderHook(() => useMapInitialization(mapContainerRef));

    expect(MaplibreMap).toHaveBeenCalledWith({
      container: mockContainer,
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=test-api-key',
      center: [0, 0],
      zoom: 2,
    });
  });

  it('should handle multiple renders with same container', () => {
    const mockContainer = document.createElement('div');
    const mapContainerRef = { current: mockContainer };

    const { rerender } = renderHook(() =>
      useMapInitialization(mapContainerRef),
    );

    expect(MaplibreMap).toHaveBeenCalledTimes(1);

    rerender();
    rerender();
    rerender();

    expect(MaplibreMap).toHaveBeenCalledTimes(1);
  });

  it('should handle container ref change from null to element', () => {
    const mapContainerRef: React.RefObject<HTMLDivElement | null> = {
      current: null,
    };

    renderHook(() => useMapInitialization(mapContainerRef));

    expect(MaplibreMap).not.toHaveBeenCalled();

    const mockContainer = document.createElement('div');
    mapContainerRef.current = mockContainer;

    renderHook(() => useMapInitialization(mapContainerRef));
    
    expect(MaplibreMap).toHaveBeenCalledWith({
      container: mockContainer,
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=test-api-key',
      center: [0, 0],
      zoom: 2,
    });
  });
});
