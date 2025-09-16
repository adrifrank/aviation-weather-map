import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayerFilter } from './LayerFilter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/styles/theme';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('LayerFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render both toggle buttons', () => {
    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={() => {}} />,
    );

    expect(screen.getByTestId('layer-toggle-sigmet')).toBeDefined();
    expect(screen.getByTestId('layer-toggle-airsigmet')).toBeDefined();
  });

  it('should display correct button labels', () => {
    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={() => {}} />,
    );

    expect(screen.getByText('SIGMET')).toBeDefined();
    expect(screen.getByText('AIRSIGMET')).toBeDefined();
  });

  it('should render the Layers title', () => {
    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={() => {}} />,
    );

    expect(screen.getByText('Layers')).toBeDefined();
  });

  it('should show selected state for visible layers', () => {
    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet']}
        onVisibleLayersChange={() => {}}
      />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    expect(sigmetButton.getAttribute('aria-pressed')).toBe('true');
    expect(airsigmetButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('should show multiple selected layers', () => {
    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet', 'airsigmet']}
        onVisibleLayersChange={() => {}}
      />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    expect(sigmetButton.getAttribute('aria-pressed')).toBe('true');
    expect(airsigmetButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('should call onVisibleLayersChange when a button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet']}
        onVisibleLayersChange={handleChange}
      />,
    );

    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    await user.click(airsigmetButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(['sigmet', 'airsigmet']);
  });

  it('should add layer when clicking unselected button', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet']}
        onVisibleLayersChange={handleChange}
      />,
    );

    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');
    await user.click(airsigmetButton);

    expect(handleChange).toHaveBeenCalledWith(['sigmet', 'airsigmet']);
  });

  it('should remove layer when clicking selected button', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet', 'airsigmet']}
        onVisibleLayersChange={handleChange}
      />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    await user.click(sigmetButton);

    expect(handleChange).toHaveBeenCalledWith(['airsigmet']);
  });

  it('should remove layer when clicking selected button', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet']}
        onVisibleLayersChange={handleChange}
      />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');

    await user.click(sigmetButton);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('should add layer when clicking unselected button', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={handleChange} />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');

    await user.click(sigmetButton);
    expect(handleChange).toHaveBeenCalledWith(['sigmet']);
  });

  it('should handle empty visibleLayers array', () => {
    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={() => {}} />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    expect(sigmetButton.getAttribute('aria-pressed')).toBe('false');
    expect(airsigmetButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('should handle clicking both buttons in sequence', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderWithTheme(
      <LayerFilter visibleLayers={[]} onVisibleLayersChange={handleChange} />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    await user.click(sigmetButton);
    expect(handleChange).toHaveBeenCalledWith(['sigmet']);

    handleChange.mockClear();

    await user.click(airsigmetButton);
    expect(handleChange).toHaveBeenCalledWith(['airsigmet']);
  });

  it('should have proper accessibility attributes', () => {
    renderWithTheme(
      <LayerFilter
        visibleLayers={['sigmet']}
        onVisibleLayersChange={() => {}}
      />,
    );

    const sigmetButton = screen.getByTestId('layer-toggle-sigmet');
    const airsigmetButton = screen.getByTestId('layer-toggle-airsigmet');

    expect(sigmetButton.getAttribute('aria-pressed')).toBe('true');
    expect(airsigmetButton.getAttribute('aria-pressed')).toBe('false');

    expect(sigmetButton).toBeDefined();
    expect(airsigmetButton).toBeDefined();
  });
});
