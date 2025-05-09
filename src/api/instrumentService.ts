import { Instrument, Model, HalApi, FileItem, PaginationParams, PaginatedResponse, ExplorerResponse } from '../types';
import { config } from './config';
import { mockInstruments, mockModels, mockHalApi } from './mockData';

const BASE_URL = config.apiBaseUrl;

// Transform API response to frontend model
const transformInstrumentData = (name: string, data: any): Instrument => ({
  id: name,
  name,
  type: name,
  driverCount: data.no_of_drivers || 0,
  hasAbstractClass: data.hal || false,
  hasDocs: data.docs || false,
  hasSoftPanel: data.soft_panel || false,
  hasApi: data.api || false,
  documentation: data.documentation || false
});

// Cache storage
const cache = {
  instruments: new Map<string, { data: any; timestamp: number }>(),
  models: new Map<string, { data: any; timestamp: number }>(),
  halApi: new Map<string, { data: any; timestamp: number }>(),
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

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getInstruments = async (params: PaginationParams): Promise<PaginatedResponse<Instrument>> => {
  try {
    if (config.mockApi) {
      await delay(300);
      let filteredInstruments = [...mockInstruments];

      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredInstruments = filteredInstruments.filter(inst =>
          inst.name.toLowerCase().includes(searchLower)
        );
      }

      if (params.sortBy) {
        filteredInstruments.sort((a: any, b: any) => {
          const aVal = a[params.sortBy!];
          const bVal = b[params.sortBy!];
          const order = params.sortOrder === 'desc' ? -1 : 1;
          return aVal > bVal ? order : -order;
        });
      }

      const total = filteredInstruments.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;

      return {
        data: filteredInstruments.slice(start, end),
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize)
      };
    }

    const response = await fetch(`${BASE_URL}/instruments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
};

export const getInstrumentById = async (id: string): Promise<Instrument | undefined> => {
  const cached = getCached(id, cache.instruments);
  if (cached) return cached;

  if (config.mockApi) {
    await delay(200);
    const instrument = mockInstruments.find(i => i.id === id);
    if (instrument) {
      setCache(id, instrument, cache.instruments);
    }
    return instrument;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${id}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    setCache(id, data, cache.instruments);
    return data;
  } catch (error) {
    console.error('Error fetching instrument:', error);
    throw error;
  }
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

export const getFileContent = async (fileId: string): Promise<FileItem | undefined> => {
  const cached = getCached(fileId, cache.files);
  if (cached) return cached;

  if (config.mockApi) {
    await delay(200);
    const file = mockHalApi
      .flatMap(hal => hal.files)
      .find(f => f.id === fileId);
    if (file) {
      setCache(fileId, file, cache.files);
    }
    return file;
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

export const getExplorerData = async (): Promise<ExplorerResponse> => {
  if (config.mockApi) {
    await delay(300);
    const mockExplorerResponse: ExplorerResponse = {};

    mockInstruments.forEach(instrument => {
      const instrumentModels = mockModels.filter(m => m.instrumentId === instrument.id);
      const modelsList = instrumentModels.map(model => ({
        [model.name.toLowerCase()]: {
          panel: true,
          manual: true,
          driver: true
        }
      }));

      mockExplorerResponse[instrument.type] = {
        hal: instrument.hasAbstractClass || false,
        documentation: instrument.documentation || false,
        panel: instrument.hasSoftPanel || false,
        api: instrument.hasApi || false,
        models: modelsList
      };
    });

    return mockExplorerResponse;
  }

  try {
    const response = await fetch(`${BASE_URL}/explorer`);
    if (!response.ok) {
      throw new Error('Failed to fetch explorer data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching explorer data:', error);
    throw error;
  }
};