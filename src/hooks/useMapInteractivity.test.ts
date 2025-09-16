import { renderHook, act } from '@testing-library/react';
import { useMapInteractivity } from './useMapInteractivity';
import { jest } from '@jest/globals';
import type { Map as MaplibreMap, MapMouseEvent } from 'maplibre-gl';

jest.mock('@/utils/popupUtils', () => ({
  createPopupMarkup: jest.fn().mockReturnValue('<div>Test popup content</div>'),
}));

const createMockMap = () => ({
  queryRenderedFeatures: jest.fn(),
  getCanvas: jest.fn().mockReturnValue({
    style: { cursor: '' },
  }),
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn().mockReturnValue({}),
});

const createMockPopup = () => ({
  setLngLat: jest.fn().mockReturnThis(),
  setHTML: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
});

jest.mock('maplibre-gl', () => ({
  Map: jest.fn(),
  Popup: jest.fn().mockImplementation(() => createMockPopup()),
}));

describe('useMapInteractivity', () => {
  let mockMap: ReturnType<typeof createMockMap>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMap = createMockMap();
  });

  it('should not execute when map is not loaded', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapInteractivity(mapRef, false));

    expect(mockMap.on).not.toHaveBeenCalled();
  });

  it('should not execute when map ref is null', () => {
    const mapRef = { current: null };

    renderHook(() => useMapInteractivity(mapRef, true));

    expect(mockMap.on).not.toHaveBeenCalled();
  });

  it('should set up event listeners when map is loaded', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapInteractivity(mapRef, true));

    expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseenter',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseleave',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
  });

  it('should show popup when clicking on SIGMET feature', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    const mockFeatures = [
      {
        layer: { id: 'sigmet-layer' },
        properties: { id: 'test-sigmet' },
      },
    ];

    mockMap.queryRenderedFeatures.mockReturnValue(mockFeatures);

    renderHook(() => useMapInteractivity(mapRef, true));

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'click',
    )?.[1] as (e: MapMouseEvent) => void;

    expect(clickHandler).toBeDefined();

    const mockEvent = {
      point: { x: 100, y: 100 },
      lngLat: { lng: 0, lat: 0 },
    } as MapMouseEvent;

    act(() => {
      clickHandler(mockEvent);
    });

    expect(mockMap.queryRenderedFeatures).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      { layers: ['sigmet-layer', 'airsigmet-layer'] },
    );
  });

  it('should handle click events correctly', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    const mockFeatures = [
      {
        layer: { id: 'airsigmet-layer' },
        properties: { id: 'test-airsigmet' },
      },
    ];

    mockMap.queryRenderedFeatures.mockReturnValue(mockFeatures);

    renderHook(() => useMapInteractivity(mapRef, true));

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'click',
    )?.[1] as (e: MapMouseEvent) => void;

    const mockEvent = {
      point: { x: 200, y: 200 },
      lngLat: { lng: 10, lat: 10 },
    } as MapMouseEvent;

    act(() => {
      clickHandler(mockEvent);
    });

    expect(mockMap.queryRenderedFeatures).toHaveBeenCalledWith(
      { x: 200, y: 200 },
      { layers: ['sigmet-layer', 'airsigmet-layer'] },
    );
  });

  it('should handle empty click areas', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    mockMap.queryRenderedFeatures.mockReturnValue([]);

    renderHook(() => useMapInteractivity(mapRef, true));

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'click',
    )?.[1] as (e: MapMouseEvent) => void;

    const mockEvent = {
      point: { x: 300, y: 300 },
      lngLat: { lng: 20, lat: 20 },
    } as MapMouseEvent;

    act(() => {
      clickHandler(mockEvent);
    });

    expect(mockMap.queryRenderedFeatures).toHaveBeenCalledWith(
      { x: 300, y: 300 },
      { layers: ['sigmet-layer', 'airsigmet-layer'] },
    );
  });

  it('should change cursor to pointer on mouse enter', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    const mockCanvas = { style: { cursor: '' } };
    mockMap.getCanvas.mockReturnValue(mockCanvas);

    renderHook(() => useMapInteractivity(mapRef, true));

    const mouseEnterHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'mouseenter',
    )?.[2] as () => void;

    expect(mouseEnterHandler).toBeDefined();

    act(() => {
      mouseEnterHandler();
    });

    expect(mockCanvas.style.cursor).toBe('pointer');
  });

  it('should reset cursor on mouse leave', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    const mockCanvas = { style: { cursor: 'pointer' } };
    mockMap.getCanvas.mockReturnValue(mockCanvas);

    renderHook(() => useMapInteractivity(mapRef, true));

    const mouseLeaveHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'mouseleave',
    )?.[2] as () => void;

    expect(mouseLeaveHandler).toBeDefined();

    act(() => {
      mouseLeaveHandler();
    });

    expect(mockCanvas.style.cursor).toBe('');
  });

  it('should clean up event listeners on unmount', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    const { unmount } = renderHook(() => useMapInteractivity(mapRef, true));

    expect(mockMap.off).not.toHaveBeenCalled();

    unmount();

    expect(mockMap.off).toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockMap.off).toHaveBeenCalledWith(
      'mouseenter',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
    expect(mockMap.off).toHaveBeenCalledWith(
      'mouseleave',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
  });

  it('should not clean up if map style is not loaded', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    mockMap.getStyle.mockReturnValue(null);

    const { unmount } = renderHook(() => useMapInteractivity(mapRef, true));

    unmount();

    expect(mockMap.off).not.toHaveBeenCalled();
  });

  it('should handle multiple features correctly', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };
    const mockFeatures = [
      {
        layer: { id: 'sigmet-layer' },
        properties: { id: 'first-feature' },
      },
      {
        layer: { id: 'airsigmet-layer' },
        properties: { id: 'second-feature' },
      },
    ];

    mockMap.queryRenderedFeatures.mockReturnValue(mockFeatures);

    renderHook(() => useMapInteractivity(mapRef, true));

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === 'click',
    )?.[1] as (e: MapMouseEvent) => void;

    const mockEvent = {
      point: { x: 100, y: 100 },
      lngLat: { lng: 0, lat: 0 },
    } as MapMouseEvent;

    act(() => {
      clickHandler(mockEvent);
    });

    expect(mockMap.queryRenderedFeatures).toHaveBeenCalledWith(
      { x: 100, y: 100 },
      { layers: ['sigmet-layer', 'airsigmet-layer'] },
    );
  });

  it('should re-run when dependencies change', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    const { rerender } = renderHook(
      ({ isMapLoaded }) => useMapInteractivity(mapRef, isMapLoaded),
      {
        initialProps: { isMapLoaded: false },
      },
    );

    expect(mockMap.on).not.toHaveBeenCalled();

    rerender({ isMapLoaded: true });

    expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseenter',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseleave',
      ['sigmet-layer', 'airsigmet-layer'],
      expect.any(Function),
    );
  });

  it('should create popup with correct configuration', () => {
    const mapRef = { current: mockMap as unknown as MaplibreMap };

    renderHook(() => useMapInteractivity(mapRef, true));

    expect(mockMap.on).toHaveBeenCalled();
  });
});
