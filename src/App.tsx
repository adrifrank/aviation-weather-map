import { Box } from '@mui/material';
import { Map } from '@/components/Map';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Map />
      </Box>
    </Box>
  );
}

export default App;
