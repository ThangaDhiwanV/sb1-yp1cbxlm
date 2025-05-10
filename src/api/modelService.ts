import { Model, FileItem } from '../types';
import { config } from './config';
import { delay } from '../utils/delay';

const BASE_URL = config.apiBaseUrl;

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
  if (!instrumentId) {
    throw new Error('Instrument ID is required');
  }

  const cached = getCached(instrumentId, cache.models);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    const models = Array.isArray(data) ? data : data.models || [];
    setCache(instrumentId, models, cache.models);
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const openModelPanel = async (instrumentId: string, modelId: string): Promise<boolean> => {
  if (!instrumentId || !modelId) {
    throw new Error('Both Instrument ID and Model ID are required');
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
  if (!fileId) {
    throw new Error('File ID is required');
  }

  const cached = getCached(fileId, cache.files);
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
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
  if (!fileId) {
    throw new Error('File ID is required');
  }

  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      // Update cache if save was successful
      const fileData = await response.json();
      setCache(fileId, fileData, cache.files);
    }

    return response.ok;
  } catch (error) {
    console.error('Error saving file content:', error);
    throw error;
  }
};