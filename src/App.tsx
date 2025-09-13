import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Map } from '@/components/Map';
import { getSigmetData, getAirsigmetData } from '@/services/weatherApi';
import type { FeatureCollection } from 'geojson';

function App() {
  const [sigmetData, setSigmetData] = useState<FeatureCollection | null>(null);
  const [airsigmetData, setAirsigmetData] = useState<FeatureCollection | null>(
    null,
  );

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
        <Map sigmetData={sigmetData} airsigmetData={airsigmetData} />
      </Box>
    </Box>
  );
}

export default App;
