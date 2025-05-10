import { Model, FileItem } from '../types';
import { config } from './config';

const BASE_URL = config.apiBaseUrl;

// Cache storage
const cache = {
  models: new Map<string, { data: Model[]; timestamp: number }>(),
  files: new Map<string, { data: FileItem; timestamp: number }>()
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

  if (config.mockApi) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockModels: Model[] = [
      {
        id: 'm1',
        name: 'Model A',
        instrumentId,
        status: 'active',
        lastUpdated: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        files: []
      },
      {
        id: 'm2',
        name: 'Model B',
        instrumentId,
        status: 'offline',
        lastUpdated: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        files: []
      }
    ];
    setCache(instrumentId, mockModels, cache.models);
    return mockModels;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/models`);
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

  if (config.mockApi) {
    await new Promise(resolve => setTimeout(resolve, 500));
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
  if (!fileId) {
    throw new Error('File ID is required');
  }

  const cached = getCached(fileId, cache.files);
  if (cached) return cached;

  if (config.mockApi) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const mockFile: FileItem = {
      id: fileId,
      name: 'Mock File',
      type: 'driver',
      content: '// Mock file content\nfunction mockFunction() {\n  return true;\n}',
      lastModified: new Date().toISOString(),
      author: 'System',
      version: '1.0.0',
      allowedActions: ['edit', 'download', 'view']
    };
    setCache(fileId, mockFile, cache.files);
    return mockFile;
  }

  try {
    const response = await fetch(`${BASE_URL}/files/${fileId}`);
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

  if (config.mockApi) {
    await new Promise(resolve => setTimeout(resolve, 500));
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

    if (response.ok) {
      const fileData = await response.json();
      setCache(fileId, fileData, cache.files);
    }

    return response.ok;
  } catch (error) {
    console.error('Error saving file content:', error);
    throw error;
  }
};