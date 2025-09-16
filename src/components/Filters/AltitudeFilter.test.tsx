import { render, screen } from '@testing-library/react';
import { AltitudeFilter } from './AltitudeFilter';

describe('AltitudeFilter', () => {
  const defaultProps = {
    altitudeRange: [10000, 30000],
    onAltitudeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the slider with correct initial values', () => {
    render(<AltitudeFilter {...defaultProps} />);

    expect(screen.getByText('Altitude Range')).toBeInTheDocument();
    expect(screen.getByText('10000 ft - 30000 ft')).toBeInTheDocument();

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    expect(sliders[0].getAttribute('aria-valuenow')).toBe('10000');
    expect(sliders[1].getAttribute('aria-valuenow')).toBe('30000');
  });

  it('should display correct altitude range text', () => {
    const customRange = [5000, 25000];
    render(
      <AltitudeFilter
        altitudeRange={customRange}
        onAltitudeChange={jest.fn()}
      />,
    );

    expect(screen.getByText('5000 ft - 25000 ft')).toBeInTheDocument();
  });

  it('should have correct slider attributes', () => {
    render(<AltitudeFilter {...defaultProps} />);

    const sliderContainer = screen.getByTestId('altitude-slider-container');
    expect(sliderContainer).toBeInTheDocument();

    const sliders = screen.getAllByRole('slider');
    sliders.forEach((slider) => {
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '48000');
    });
  });

  it('should call onAltitudeChange when slider value changes', () => {
    const mockOnAltitudeChange = jest.fn();

    render(
      <AltitudeFilter
        altitudeRange={[10000, 30000]}
        onAltitudeChange={mockOnAltitudeChange}
      />,
    );

    const sliders = screen.getAllByRole('slider');

    expect(sliders[0]).toHaveAttribute('aria-valuenow', '10000');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '30000');

    expect(sliders[0]).toHaveAttribute('aria-valuemin', '0');
    expect(sliders[0]).toHaveAttribute('aria-valuemax', '48000');
  });

  it('should handle edge case values correctly', () => {
    const edgeCaseRange = [0, 48000];
    render(
      <AltitudeFilter
        altitudeRange={edgeCaseRange}
        onAltitudeChange={jest.fn()}
      />,
    );

    expect(screen.getByText('0 ft - 48000 ft')).toBeInTheDocument();

    const sliders = screen.getAllByRole('slider');
    expect(sliders[0].getAttribute('aria-valuenow')).toBe('0');
    expect(sliders[1].getAttribute('aria-valuenow')).toBe('48000');
  });

  it('should render with different altitude ranges', () => {
    const testCases = [
      [0, 1000],
      [15000, 20000],
      [35000, 40000],
      [0, 48000],
    ];

    testCases.forEach((range) => {
      const { unmount } = render(
        <AltitudeFilter altitudeRange={range} onAltitudeChange={jest.fn()} />,
      );

      expect(
        screen.getByText(`${range[0]} ft - ${range[1]} ft`),
      ).toBeInTheDocument();

      const sliders = screen.getAllByRole('slider');
      expect(sliders[0].getAttribute('aria-valuenow')).toBe(
        range[0].toString(),
      );
      expect(sliders[1].getAttribute('aria-valuenow')).toBe(
        range[1].toString(),
      );

      unmount();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<AltitudeFilter {...defaultProps} />);

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);

    sliders.forEach((slider) => {
      expect(slider).toHaveAttribute('aria-valuemin');
      expect(slider).toHaveAttribute('aria-valuemax');
      expect(slider).toHaveAttribute('aria-valuenow');
    });
  });

  it('should maintain slider order (lower bound first, upper bound second)', () => {
    render(<AltitudeFilter {...defaultProps} />);

    const sliders = screen.getAllByRole('slider');
    const lowerBound = parseInt(
      sliders[0].getAttribute('aria-valuenow') || '0',
    );
    const upperBound = parseInt(
      sliders[1].getAttribute('aria-valuenow') || '0',
    );

    expect(lowerBound).toBeLessThanOrEqual(upperBound);
  });
});
