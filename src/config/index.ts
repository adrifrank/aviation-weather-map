const mapTilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;

if (mapTilerApiKey === undefined) {
  throw new Error('MapTiler API key is not defined in .env.local file');
}

export const MAPTILER_API_KEY = mapTilerApiKey;
