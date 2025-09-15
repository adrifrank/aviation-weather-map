import { Paper, Divider } from '@mui/material';
import { LayerFilter } from './LayerFilter';
import { AltitudeFilter } from './AltitudeFilter';

interface FiltersProps {
  visibleLayers: string[];
  onVisibleLayersChange: (layers: string[]) => void;
  altitudeRange: number[];
  onAltitudeChange: (altitude: number[]) => void;
}

export const Filters = ({
  visibleLayers,
  onVisibleLayersChange,
  altitudeRange,
  onAltitudeChange,
}: FiltersProps) => {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 320,
        padding: '20px',
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 1,
      }}
    >
      <LayerFilter
        visibleLayers={visibleLayers}
        onVisibleLayersChange={onVisibleLayersChange}
      />

      <Divider sx={{ my: 2 }} />

      <AltitudeFilter
        altitudeRange={altitudeRange}
        onAltitudeChange={onAltitudeChange}
      />
    </Paper>
  );
};
