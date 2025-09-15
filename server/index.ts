import express from 'express';
import cors from 'cors';
import { cacheMiddleware } from './middleware/cacheMiddleware.js';
import { getSigmet, getAirsigmet } from './controllers/weatherController.js';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/isigmet', cacheMiddleware, getSigmet);
app.get('/airsigmet', cacheMiddleware, getAirsigmet);

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
