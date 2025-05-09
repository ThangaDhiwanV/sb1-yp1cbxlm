import { HalApi } from '../types';
import { config } from './config';
import { mockHalApi } from './mockData';

const BASE_URL = config.apiBaseUrl;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache storage
const cache = {
  halApi: new Map<string, { data: any; timestamp: number }>(),
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = <T>(key: string, map: Map<string, { data: T; timestamp: number }>) => {
  const cached = map.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCache = <T>(key: string, data: T, map: Map<string, { data: T; timestamp: number }>) => {
  map.set(key, { data, timestamp: Date.now() });
};

export const getHalApiByInstrumentId = async (instrumentId: string): Promise<HalApi | undefined> => {
  const cached = getCached(instrumentId, cache.halApi);
  if (cached) return cached;

  if (config.mockApi) {
    await delay(300);
    const api = mockHalApi.find(hal => hal.instrumentId === instrumentId);
    if (api) {
      setCache(instrumentId, api, cache.halApi);
    }
    return api;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/hal-api`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    setCache(instrumentId, data, cache.halApi);
    return data;
  } catch (error) {
    console.error('Error fetching HAL API:', error);
    throw error;
  }
};