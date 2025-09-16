import { Typography, Box, Slider } from '@mui/material';

interface AltitudeFilterProps {
  altitudeRange: number[];
  onAltitudeChange: (altitude: number[]) => void;
}

export const AltitudeFilter = ({
  altitudeRange,
  onAltitudeChange,
}: AltitudeFilterProps) => {
  const handleAltitudeChange = (_: Event, newValue: number | number[]) => {
    onAltitudeChange(newValue as number[]);
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 0.5 }}>
        Altitude Range
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, mb: 1 }}
      >
        {`${altitudeRange[0]} ft - ${altitudeRange[1]} ft`}
      </Typography>

      <Box sx={{ px: '8px' }}>
        <Slider
          value={altitudeRange}
          onChange={handleAltitudeChange}
          min={0}
          max={48000}
          step={1000}
          disableSwap
          data-testid="altitude-slider-container"
        />
      </Box>
    </Box>
  );
};
