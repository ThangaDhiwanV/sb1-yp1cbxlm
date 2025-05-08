import { Instrument, Model, HalApi, FileItem } from '../types';

// Common content
const abstractClassContent = `from abc import ABC, abstractmethod

class Abstract_Class(ABC):
    """Base class for all instruments."""

    @abstractmethod
    def initialize(self) -> bool:
        """Initialize the instrument.

        Returns:
            bool: True if initialization successful, False otherwise
        """
        pass

    @abstractmethod
    def reset(self) -> None:
        """Reset the instrument to default state."""
        pass

    @abstractmethod
    def self_test(self) -> tuple[bool, str]:
        """Run instrument self-test.

        Returns:
            tuple[bool, str]: (passed, message)
        """
        pass

    @abstractmethod
    def close(self) -> None:
        """Close connection to instrument."""
        pass`;

// Mock data
const instruments: Instrument[] = [
  {
    id: '1',
    name: 'SMU',
    type: 'SMU',
    driverCount: 2  // Keithley2500 and NI SMU drivers
  },
  {
    id: '2',
    name: 'DMM',
    type: 'DMM',
    driverCount: 1  // Agilent DMM driver
  },
];

const models: Model[] = [
  {
    id: 'm1',
    name: 'Keithley2500',
    instrumentId: '1',
    status: 'active',
    lastUpdated: '2024-03-15T10:30:00Z',
    createdDate: '2024-01-15T08:00:00Z',
    files: [
      {
        id: 'f1',
        name: 'Driver',
        type: 'driver',
        content: 'function initializeKeithley2500() {\n  // Initialize hardware\n  return true;\n}',
        lastModified: '2024-03-14T15:20:00Z',
        author: 'John Doe',
        version: '1.2.0',
        allowedActions: ['edit', 'download', 'view']
      },
      {
        id: 'f2',
        name: 'Manual',
        type: 'manual',
        content: 'class KeithleyManual {\n  constructor() {\n    this.initialized = false;\n  }\n\n  init() {\n    this.initialized = true;\n  }\n}',
        lastModified: '2024-03-13T09:45:00Z',
        author: 'Jane Smith',
        version: '2.0.1',
        allowedActions: ['download', 'view']
      },
    ],
  },
  {
    id: 'm2',
    name: 'NI SMU',
    instrumentId: '1',
    status: 'offline',
    lastUpdated: '2024-03-14T16:45:00Z',
    createdDate: '2024-02-01T09:30:00Z',
    files: [
      {
        id: 'f3',
        name: 'Driver',
        type: 'driver',
        content: 'function initializeNISMU() {\n  // Initialize hardware\n  return true;\n}',
        lastModified: '2024-03-12T11:30:00Z',
        author: 'Mike Johnson',
        version: '1.1.0',
        allowedActions: ['edit', 'download', 'view']
      },
    ],
  },
  {
    id: 'm3',
    name: 'Agilent DMM',
    instrumentId: '2',
    status: 'active',
    lastUpdated: '2024-03-13T14:30:00Z',
    createdDate: '2024-01-20T11:15:00Z',
    files: [
      {
        id: 'f4',
        name: 'Driver',
        type: 'driver',
        content: 'function initializeAgilentDMM() {\n  // Initialize hardware\n  return true;\n}',
        lastModified: '2024-03-13T14:30:00Z',
        author: 'David Wilson',
        version: '1.0.0'
      },
    ],
  },
];

const halApi: HalApi[] = [
  {
    id: 'h1',
    instrumentId: '1',
    files: [
      {
        id: 'h1f1',
        name: 'Documentation',
        type: 'Documentation',
        content: '# SMU Documentation\n\nThis document describes the Documentation for SMU instruments.',
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      },
      {
        id: 'h1f3',
        name: 'Abstract_Class',
        type: 'abstract',
        content: abstractClassContent,
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      },
      {
        id: 'h1f2',
        name: 'API',
        type: 'api',
        content: 'class SmuApi {\n  measure() {\n    // Measure voltage/current\n  }\n\n  source() {\n    // Source voltage/current\n  }\n}',
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      }
    ],
  },
  {
    id: 'h2',
    instrumentId: '2',
    files: [
      {
        id: 'h2f1',
        name: 'Documentation',
        type: 'Documentation',
        content: '# DMM Documentation\n\nThis document describes the Documentation for DMM instruments.',
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      },
      {
        id: 'h2f2',
        name: 'API',
        type: 'api',
        content: 'class DmmApi {\n  measure() {\n    // Measure voltage/resistance\n  }\n}',
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      },
      {
        id: 'h2f3',
        name: 'Abstract_Class',
        type: 'abstract',
        content: abstractClassContent,
        lastModified: '2024-03-14T10:30:00Z',
        author: 'System',
        version: '1.0.0',
        allowedActions: ['edit', 'download', 'view']
      }
    ],
  },
];

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Add pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  type?: string;
  search?: string;
  sortBy?: 'name' | 'type';
  sortOrder?: 'asc' | 'desc';
}

// Update getInstruments to support pagination
export const getInstruments = async (params: PaginationParams): Promise<PaginatedResponse<Instrument>> => {
  const cacheKey = JSON.stringify(params);
  const cached = getCached(cacheKey, cache.instruments);
  if (cached) return cached;

  await delay(300);

  let filteredInstruments = [...instruments];

  if (params.type) {
    filteredInstruments = filteredInstruments.filter(i =>
      i.type.toLowerCase() === params.type?.toLowerCase()
    );
  }

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredInstruments = filteredInstruments.filter(i =>
      i.name.toLowerCase().includes(searchLower) ||
      i.type.toLowerCase().includes(searchLower)
    );
  }

  // Sort instruments
  if (params.sortBy) {
    filteredInstruments.sort((a, b) => {
      let comparison = 0;
      switch (params.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return params.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  const total = filteredInstruments.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;

  const result = {
    data: filteredInstruments.slice(start, end),
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
  };

  setCache(cacheKey, result, cache.instruments);
  return result;
};

export const getInstrumentById = async (id: string): Promise<Instrument | undefined> => {
  const cached = getCached(id, cache.instruments);
  if (cached) return cached;

  await delay(200);
  const instrument = instruments.find(instrument => instrument.id === id);
  if (instrument) {
    setCache(id, instrument, cache.instruments);
  }
  return instrument;
};

export const getModelsByInstrumentId = async (instrumentId: string): Promise<Model[]> => {
  const cached = getCached(instrumentId, cache.models);
  if (cached) return cached;

  await delay(300);
  const filteredModels = models.filter(model => model.instrumentId === instrumentId);
  setCache(instrumentId, filteredModels, cache.models);
  return filteredModels;
};

export const getHalApiByInstrumentId = async (instrumentId: string): Promise<HalApi | undefined> => {
  const cached = getCached(instrumentId, cache.halApi);
  if (cached) return cached;

  await delay(300);
  const api = halApi.find(hal => hal.instrumentId === instrumentId);
  if (api) {
    setCache(instrumentId, api, cache.halApi);
  }
  return api;
};

export const getFileContent = async (fileId: string): Promise<FileItem | undefined> => {
  const cached = getCached(fileId, cache.files);
  if (cached) return cached;

  await delay(200);

  // Search in models
  for (const model of models) {
    const file = model.files.find(f => f.id === fileId);
    if (file) {
      setCache(fileId, file, cache.files);
      return file;
    }
  }

  // Search in HAL/API
  for (const hal of halApi) {
    const file = hal.files.find(f => f.id === fileId);
    if (file) {
      setCache(fileId, file, cache.files);
      return file;
    }
  }

  return undefined;
};

export const saveFileContent = async (fileId: string, content: string): Promise<boolean> => {
  await delay(400);

  // Update in models
  for (const model of models) {
    const fileIndex = model.files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      model.files[fileIndex].content = content;
      return true;
    }
  }

  // Update in HAL/API
  for (const hal of halApi) {
    const fileIndex = hal.files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      hal.files[fileIndex].content = content;
      return true;
    }
  }

  return false;
};

export const downloadFile = async (fileId: string): Promise<{ content: string, name: string } | undefined> => {
  await delay(300);

  // Find file in models
  for (const model of models) {
    const file = model.files.find(f => f.id === fileId);
    if (file) {
      return {
        content: file.content,
        name: `${file.name.toLowerCase().replace(/\s+/g, '-')}.js`,
      };
    }
  }

  // Find file in HAL/API
  for (const hal of halApi) {
    const file = hal.files.find(f => f.id === fileId);
    if (file) {
      return {
        content: file.content,
        name: `${file.name.toLowerCase().replace(/\s+/g, '-')}.js`,
      };
    }
  }

  return undefined;
};