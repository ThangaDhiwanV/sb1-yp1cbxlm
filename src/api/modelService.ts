import { Model, FileItem } from '../types';
import { config } from './config';
import { mockModels } from './mockData';

const BASE_URL = config.apiBaseUrl;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache storage
const cache = {
  models: new Map<string, { data: any; timestamp: number }>(),
  files: new Map<string, { data: any; timestamp: number }>()
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

export const getModelsByInstrumentId = async (instrumentId: string): Promise<Model[]> => {
  const cached = getCached(instrumentId, cache.models);
  if (cached) return cached;

  if (config.mockApi) {
    await delay(300);
    const models = mockModels.filter(model => model.instrumentId === instrumentId);
    setCache(instrumentId, models, cache.models);
    return models;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/models`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    setCache(instrumentId, data, cache.models);
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const openModelPanel = async (instrumentId: string, modelId: string): Promise<boolean> => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/models/${modelId}/panel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error opening model panel:', error);
    throw error;
  }
};

export const getFileContent = async (fileId: string): Promise<FileItem | undefined> => {
  const cached = getCached(fileId, cache.files);
  if (cached) return cached;

  if (config.mockApi) {
    await delay(200);
    for (const model of mockModels) {
      const file = model.files.find(f => f.id === fileId);
      if (file) {
        setCache(fileId, file, cache.files);
        return file;
      }
    }
    return undefined;
  }

  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    setCache(fileId, data, cache.files);
    return data;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
};

export const saveFileContent = async (fileId: string, content: string): Promise<boolean> => {
  if (config.mockApi) {
    await delay(400);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving file content:', error);
    throw error;
  }
};