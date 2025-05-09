import { Instrument, Model, HalApi, FileItem, PaginationParams, PaginatedResponse, ExplorerResponse } from '../types';

const BASE_URL = 'http://localhost:8000';
const USE_MOCK = false;

// Mock data with varying feature availability
const mockInstruments: Record<string, any> = {
  "DMM": {
    abstract_class: true,
    no_of_drivers: 2,
    documentation: true,
    soft_panel: false,
    api: true,
    docs: true
  },
  "SMU": {
    abstract_class: false,
    no_of_drivers: 3,
    documentation: false,
    soft_panel: true,
    api: false,
    docs: false
  },
  "Power Supply": {
    abstract_class: true,
    no_of_drivers: 1,
    documentation: true,
    soft_panel: true,
    api: true,
    docs: true
  },
  "Oscilloscope": {
    abstract_class: false,
    no_of_drivers: 0,
    documentation: false,
    soft_panel: false,
    api: false,
    docs: false
  }
};

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
    driverCount: 2
  },
  {
    id: '2',
    name: 'DMM',
    type: 'DMM',
    driverCount: 1
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

// Update getInstruments to support pagination
export const getInstruments = async (params: PaginationParams): Promise<PaginatedResponse<Instrument>> => {
  try {
    let data: Record<string, any>;

    if (USE_MOCK) {
      data = mockInstruments;
    } else {
      const response = await fetch(`${BASE_URL}/instrument/`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      data = await response.json();
    }

    const instruments = Object.entries(data).map(([name, details]) =>
      transformInstrumentData(name, details)
    );

    // Handle pagination
    const total = instruments.length;
    const start = (params.page - 1) * params.pageSize;
    const end = start + params.pageSize;

    // Apply filters if provided
    let filteredInstruments = instruments;
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredInstruments = filteredInstruments.filter(inst =>
        inst.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredInstruments.sort((a: any, b: any) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }

    return {
      data: filteredInstruments.slice(start, end),
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize)
    };
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
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
  if (USE_MOCK) {
    const cached = getCached(instrumentId, cache.models);
    if (cached) return cached;

    await delay(300);
    const filteredModels = models.filter(model => model.instrumentId === instrumentId);
    setCache(instrumentId, filteredModels, cache.models);
    return filteredModels;
  }

  try {
    // Use the correct models endpoint instead of explorer
    const response = await fetch(`${BASE_URL}/instrument/${instrumentId}/models`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const models: Model[] = [];

    // Parse models data from the response
    const modelsData = data[instrumentId] || [];
    modelsData.forEach((modelData: any) => {
      Object.entries(modelData).forEach(([modelName, flags]: [string, any]) => {
        models.push({
          id: `${instrumentId}_${modelName}`,
          name: modelName,
          instrumentId: instrumentId,
          status: 'active',
          lastUpdated: new Date().toISOString(),
          createdDate: new Date().toISOString(),
          files: [
            // Add files based on availability flags
            ...(flags.driver ? [{
              id: `${modelName}_driver`,
              name: 'Driver',
              type: 'driver' as const,
              content: '',
              lastModified: new Date().toISOString(),
              author: 'System',
              version: '1.0.0',
              allowedActions: ['view', 'download'] as ('edit' | 'download' | 'view')[]
            }] : []),
            ...(flags.manual ? [{
              id: `${modelName}_manual`,
              name: 'Manual',
              type: 'manual' as const,
              content: '',
              lastModified: new Date().toISOString(),
              author: 'System',
              version: '1.0.0',
              allowedActions: ['view', 'download'] as ('edit' | 'download' | 'view')[]
            }] : []),
            ...(flags.panel ? [{
              id: `${modelName}_panel`,
              name: 'Panel',
              type: 'manual' as const,
              content: '',
              lastModified: new Date().toISOString(),
              author: 'System',
              version: '1.0.0',
              allowedActions: ['view'] as ('edit' | 'download' | 'view')[]
            }] : [])
          ]
        });
      });
    });

    setCache(instrumentId, models, cache.models);
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};

export const getHalApiByInstrumentId = async (instrumentId: string): Promise<HalApi | undefined> => {
  if (USE_MOCK) {
    const cached = getCached(instrumentId, cache.halApi);
    if (cached) return cached;

    await delay(300);
    const api = halApi.find(hal => hal.instrumentId === instrumentId);
    if (api) {
      setCache(instrumentId, api, cache.halApi);
    }
    return api;
  }

  try {
    // Make parallel requests to get all available resources for the instrument
    const responses = await Promise.all([
      fetch(`${BASE_URL}/instrument/${instrumentId}/hal`).then(res => res.ok ? res.json() : null),
      fetch(`${BASE_URL}/instrument/${instrumentId}/api`).then(res => res.ok ? res.json() : null),
      fetch(`${BASE_URL}/instrument/${instrumentId}/docs`).then(res => res.ok ? res.json() : null),
      fetch(`${BASE_URL}/instrument/${instrumentId}/driver`).then(res => res.ok ? res.json() : null)
    ]);

    const [halResponse, apiResponse, docsResponse, driverResponse] = responses;

    // Construct HAL API object from individual responses
    const halApi: HalApi = {
      id: instrumentId,
      instrumentId,
      files: [
        ...(halResponse ? [{
          id: `${instrumentId}_abstract`,
          name: 'Abstract_Class',
          type: 'abstract' as const,
          content: typeof halResponse === 'string' ? halResponse : JSON.stringify(halResponse, null, 2),
          lastModified: new Date().toISOString(),
          author: 'System',
          version: '1.0.0',
          allowedActions: ['view', 'download'] as ('view' | 'download' | 'edit')[]
        }] : []),
        ...(apiResponse ? [{
          id: `${instrumentId}_api`,
          name: 'API',
          type: 'api' as const,
          content: typeof apiResponse === 'string' ? apiResponse : JSON.stringify(apiResponse, null, 2),
          lastModified: new Date().toISOString(),
          author: 'System',
          version: '1.0.0',
          allowedActions: ['view', 'download'] as ('view' | 'download' | 'edit')[]
        }] : []),
        ...(docsResponse ? [{
          id: `${instrumentId}_documentation`,
          name: 'Documentation',
          type: 'Documentation' as const,
          content: typeof docsResponse === 'string' ? docsResponse : JSON.stringify(docsResponse, null, 2),
          lastModified: new Date().toISOString(),
          author: 'System',
          version: '1.0.0',
          allowedActions: ['view', 'download'] as ('view' | 'download' | 'edit')[]
        }] : []),
        ...(driverResponse ? [{
          id: `${instrumentId}_manual`,
          name: 'Manual',
          type: 'manual' as const,
          content: typeof driverResponse === 'string' ? driverResponse : JSON.stringify(driverResponse, null, 2),
          lastModified: new Date().toISOString(),
          author: 'System',
          version: '1.0.0',
          allowedActions: ['view', 'download'] as ('view' | 'download' | 'edit')[]
        }] : [])
      ]
    };

    // Only cache and return if we have any files
    if (halApi.files.length > 0) {
      setCache(instrumentId, halApi, cache.halApi);
      return halApi;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching HAL API:', error);
    throw error;
  }
};

export const getFileContent = async (fileId: string): Promise<FileItem | undefined> => {
  console.log(`[DEBUG] getFileContent called with fileId: ${fileId}`);

  try {
    // Parse the fileId to get instrument, model, and file type
    const segments = fileId.split('_');
    if (segments.length < 2) {
      throw new Error('Invalid file ID format');
    }

    const instrument = segments[0];
    const fileType = segments[segments.length - 1];
    const model = segments.length > 2 ? segments[1] : undefined;

    let endpoint = '';
    let content = '';

    // Choose endpoint based on file type
    if (model) {
      // This is a model-specific file
      switch (String(fileType).toLowerCase()) {
        case 'driver':
          endpoint = `${BASE_URL}/instrument/${instrument}/models/${model}/driver`;
          break;
        case 'manual':
          endpoint = `${BASE_URL}/instrument/${instrument}/models/${model}/manual`;
          break;
        case 'panel':
          endpoint = `${BASE_URL}/instrument/${instrument}/models/${model}/panel`;
          break;
      }
    } else {
      // This is an instrument-level file
      switch (String(fileType).toLowerCase()) {
        case 'docs':
        case 'documentation':
          endpoint = `${BASE_URL}/instrument/${instrument}/docs`;
          break;
        case 'api':
          endpoint = `${BASE_URL}/instrument/${instrument}/api`;
          break;
        case 'abstract':
        case 'hal':
          endpoint = `${BASE_URL}/instrument/${instrument}/hal`;
          break;
        case 'panel':
          endpoint = `${BASE_URL}/instrument/${instrument}/panel`;
          break;
      }
    }

    if (!endpoint) {
      throw new Error(`No endpoint found for file type: ${fileType}`);
    }

    console.log(`[DEBUG] Fetching from endpoint: ${endpoint}`);
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }

    const data = await response.text(); // Get raw text first

    try {
      // Try to parse as JSON if applicable
      const jsonData = JSON.parse(data);
      content = typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData, null, 2);
    } catch {
      // If it's not JSON, check if it's a Python file (driver or HAL)
      if (fileType === 'driver' || fileType === 'hal' || fileType === 'abstract') {
        content = data; // Keep raw content for Python files
      } else {
        // For other files, use raw text
        content = data;
      }
    }

    console.log(`[DEBUG] Content loaded successfully for ${fileId}`);

    const file: FileItem = {
      id: fileId,
      name: model ? `${model}_${fileType}` : fileType,
      type: fileType === 'driver' ? 'driver' :
        fileType === 'docs' ? 'Documentation' :
          fileType === 'abstract' || fileType === 'hal' ? 'abstract' :
            fileType as FileItem['type'],
      content,
      lastModified: new Date().toISOString(),
      author: 'System',
      version: '1.0.0',
      allowedActions: ['view', 'download']
    };

    return file;
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
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

export const openInstrumentPanel = async (instrumentId: string): Promise<boolean> => {
  if (USE_MOCK) {
    await delay(200);
    // In mock mode, just return true if the instrument has soft panel capability
    const data = mockInstruments[instrumentId];
    return data?.soft_panel || false;
  }

  try {
    const response = await fetch(`${BASE_URL}/instruments/${instrumentId}/panel`);
    if (!response.ok) {
      throw new Error(`Failed to open panel: ${response.statusText}`);
    }
    const data = await response.json();
    return data.result === "Successfully opened panel";
  } catch (error) {
    console.error('Error opening instrument panel:', error);
    throw error;
  }
};

export const getModelManual = async (instrumentId: string, modelId: string): Promise<Blob | undefined> => {
  if (USE_MOCK) {
    await delay(200);
    // Create a mock PDF blob
    const mockPDFContent = 'Mock PDF content for ' + modelId;
    return new Blob([mockPDFContent], { type: 'application/pdf' });
  }

  try {
    const response = await fetch(`${BASE_URL}/instrument/${instrumentId}/models/${modelId}/manual`, {
      headers: {
        'Accept': 'application/pdf'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch manual: ${response.statusText}`);
    }
    return response.blob();
  } catch (error) {
    console.error('Error fetching model manual:', error);
    throw error;
  }
};

export const getModelDriver = async (instrumentId: string, modelId: string): Promise<string | undefined> => {
  if (USE_MOCK) {
    await delay(200);
    return `// Mock driver content for ${modelId}\nclass ${modelId}Driver {\n  initialize() {\n    // Implementation\n  }\n}`;
  }

  try {
    const response = await fetch(`${BASE_URL}/instrument/${instrumentId}/models/${modelId}/driver`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch driver: ${response.statusText}`);
    }
    const data = await response.json();
    return data.driver;
  } catch (error) {
    console.error('Error fetching model driver:', error);
    throw error;
  }
};

export const openModelPanel = async (instrumentId: string, modelId: string): Promise<boolean> => {
  if (USE_MOCK) {
    await delay(200);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/instrument/${instrumentId}/models/${modelId}/panel`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to open panel: ${response.statusText}`);
    }
    const data = await response.json();
    return data.result === "Successfully opened panel";
  } catch (error) {
    console.error('Error opening model panel:', error);
    throw error;
  }
};

export const getExplorerData = async (): Promise<ExplorerResponse> => {
  if (USE_MOCK) {
    // Convert mock data to ExplorerResponse format
    const mockExplorerResponse: ExplorerResponse = {};

    instruments.forEach(instrument => {
      const instrumentModels = models.filter(m => m.instrumentId === instrument.id);
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
    const response = await fetch(`${BASE_URL}/instrument/explorer`);
    if (!response.ok) {
      throw new Error('Failed to fetch explorer data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching explorer data:', error);
    throw error;
  }
};