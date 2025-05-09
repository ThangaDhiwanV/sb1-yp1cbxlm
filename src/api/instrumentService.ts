import { Instrument, PaginationParams, PaginatedResponse } from '../types';
import { config } from './config';
import { mockInstruments } from './mockData';

const BASE_URL = config.apiBaseUrl;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Cache storage
const cache = {
  instruments: new Map<string, { data: any; timestamp: number }>(),
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

export const getInstruments = async (params: PaginationParams): Promise<PaginatedResponse<Instrument>> => {
  try {
    if (config.mockApi) {
      await delay(300);
      let filteredInstruments = [...mockInstruments];

      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredInstruments = filteredInstruments.filter(inst =>
          inst.name.toLowerCase().includes(searchLower) ||
          inst.type.toLowerCase().includes(searchLower)
        );
      }

      // Apply type filter
      if (params.type) {
        filteredInstruments = filteredInstruments.filter(inst =>
          inst.type.toLowerCase() === params.type?.toLowerCase()
        );
      }

      // Apply sorting
      if (params.sortBy) {
        filteredInstruments.sort((a: any, b: any) => {
          let aVal = a[params.sortBy!];
          let bVal = b[params.sortBy!];
          
          // Handle numeric sorting for driverCount
          if (params.sortBy === 'driverCount') {
            aVal = aVal || 0;
            bVal = bVal || 0;
          }
          
          const order = params.sortOrder === 'desc' ? -1 : 1;
          if (aVal < bVal) return -1 * order;
          if (aVal > bVal) return 1 * order;
          return 0;
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

    // Real API integration
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.type && { type: params.type }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder })
    });

    const response = await fetch(`${BASE_URL}/instruments?${queryParams}`, {
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

export const getFileContent = async (fileId: string) => {
  try {
    if (config.mockApi) {
      await delay(200);
      return { content: "Mock file content" };
    }

    const response = await fetch(`${BASE_URL}/files/${fileId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

export const saveFileContent = async (fileId: string, content: string): Promise<boolean> => {
  try {
    if (config.mockApi) {
      await delay(200);
      return true;
    }

    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};