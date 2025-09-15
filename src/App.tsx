import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import type { FeatureCollection } from 'geojson';

import { getSigmetData, getAirsigmetData } from '@/services/weatherApi';

import { Map } from '@/components/Map';
import { Filters } from '@/components/Filters';

function App() {
  const [sigmetData, setSigmetData] = useState<FeatureCollection | null>(null);
  const [airsigmetData, setAirsigmetData] = useState<FeatureCollection | null>(
    null,
  );

  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    'sigmet',
    'airsigmet',
  ]);
  const [altitudeRange, setAltitudeRange] = useState<number[]>([0, 48000]);

  useEffect(() => {
    const fetchData = async () => {
      const [sigmetResponse, airsigmetResponse] = await Promise.all([
        getSigmetData(),
        getAirsigmetData(),
      ]);
      setSigmetData(sigmetResponse);
      setAirsigmetData(airsigmetResponse);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Filters
          visibleLayers={visibleLayers}
          onVisibleLayersChange={setVisibleLayers}
          altitudeRange={altitudeRange}
          onAltitudeChange={setAltitudeRange}
        />

        <Map
          sigmetData={sigmetData}
          airsigmetData={airsigmetData}
          visibleLayers={visibleLayers}
          altitudeRange={altitudeRange}
        />
      </Box>
    </Box>
  );
}

export default App;
