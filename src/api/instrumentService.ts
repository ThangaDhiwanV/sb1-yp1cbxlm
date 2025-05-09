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

export const getSortOptions = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(200);
    return ['NAME_ASC', 'NAME_DESC', 'DRIVERS_ASC', 'DRIVERS_DESC'];
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/sort`);
    if (!response.ok) {
      throw new Error('Failed to fetch sort options');
    }
    const data = await response.json();
    return data.sort_options;
  } catch (error) {
    console.error('Error fetching sort options:', error);
    throw error;
  }
};

export const getFilterOptions = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(200);
    return ['DOCUMENTATION', 'PANEL', 'API', 'HAL'];
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/filter`);
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }
    const data = await response.json();
    return data.filter_options;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
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
        const sortMapping: Record<string, string> = {
          'name-asc': 'NAME_ASC',
          'name-desc': 'NAME_DESC',
          'driverCount-asc': 'DRIVERS_ASC',
          'driverCount-desc': 'DRIVERS_DESC'
        };

        const sortKey = `${params.sortBy}-${params.sortOrder}`;
        const apiSortValue = sortMapping[sortKey];

        switch (apiSortValue) {
          case 'NAME_ASC':
            filteredInstruments.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'NAME_DESC':
            filteredInstruments.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'DRIVERS_ASC':
            filteredInstruments.sort((a, b) => (a.driverCount || 0) - (b.driverCount || 0));
            break;
          case 'DRIVERS_DESC':
            filteredInstruments.sort((a, b) => (b.driverCount || 0) - (a.driverCount || 0));
            break;
        }
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
      page_size: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
      ...(params.type && { filter: params.type }),
      ...(params.sortBy && params.sortOrder && {
        sort: `${params.sortBy.toUpperCase()}_${params.sortOrder.toUpperCase()}`
      })
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

    const data = await response.json();
    return {
      data: Object.entries(data.data).map(([type, details]: [string, any]) => ({
        id: type,
        name: type,
        type,
        driverCount: details.no_of_drivers || 0,
        hasAbstractClass: details.hal || false,
        hasDocs: details.documentation || false,
        hasSoftPanel: details.panel || false,
        hasApi: details.api || false,
        documentation: details.documentation || false
      })),
      total: data.pagination.total_items,
      page: data.pagination.page,
      pageSize: data.pagination.page_size,
      totalPages: data.pagination.total_pages
    };
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