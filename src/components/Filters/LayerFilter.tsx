import { Typography, Box, ToggleButtonGroup } from '@mui/material';
import { StyledToggleButton } from './StyledToggleButton';
import { COLORS } from '@/styles/themeConstants';

interface LayerFilterProps {
  visibleLayers: string[];
  onVisibleLayersChange: (layers: string[]) => void;
}

export const LayerFilter = ({
  visibleLayers,
  onVisibleLayersChange,
}: LayerFilterProps) => {
  const handleLayerChange = (
    _: React.MouseEvent<HTMLElement>,
    newLayers: string[],
  ) => {
    onVisibleLayersChange(newLayers);
  };

  return (
    <Box mb={2}>
      <Typography variant="body1" sx={{ mb: 1.5 }}>
        Layers
      </Typography>
      <ToggleButtonGroup
        value={visibleLayers}
        onChange={handleLayerChange}
        sx={{
          border: 'none',
          '& .MuiToggleButtonGroup-grouped': { border: 'none' },
        }}
      >
        <StyledToggleButton value="sigmet" selectedColor={COLORS.SIGMET}>
          SIGMET
        </StyledToggleButton>
        <StyledToggleButton value="airsigmet" selectedColor={COLORS.AIRSIGMET}>
          AIRSIGMET
        </StyledToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
