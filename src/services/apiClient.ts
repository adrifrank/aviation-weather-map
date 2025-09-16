import axios from 'axios';
import { AWC_API_BASE_URL } from '@/config';

const apiClient = axios.create({
  baseURL: AWC_API_BASE_URL,
});

export default apiClient;
