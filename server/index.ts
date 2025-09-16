import express from 'express';
import cors from 'cors';
import { PORT } from './config/index.js';
import { cacheMiddleware } from './middleware/cacheMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getSigmet, getAirsigmet } from './controllers/weatherController.js';

const app = express();

app.use(cors());

app.get('/isigmet', cacheMiddleware, getSigmet);
app.get('/airsigmet', cacheMiddleware, getAirsigmet);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
