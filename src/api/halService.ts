import { config } from './config';
import { delay } from '../utils/delay';

const BASE_URL = config.apiBaseUrl;

// Get available technology stacks
export const getTechStacks = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['PyVISA', 'Serial', 'SCPI'];
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/tech_stack/`);
    if (!response.ok) {
      throw new Error('Failed to fetch technology stacks');
    }
    const data = await response.json();
    return data.types;
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    throw error;
  }
};

// Get available HAL documents
export const getHalDocs = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['Multimeter', 'Oscilloscope', 'PowerSupply'];
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/hal_docs`);
    if (!response.ok) {
      throw new Error('Failed to fetch HAL documents');
    }
    const data = await response.json();
    return data.HAL;
  } catch (error) {
    console.error('Error fetching HAL docs:', error);
    throw error;
  }
};

// Generate HAL implementation
export const generateHal = async (instrumentName: string, stack: string) => {
  if (config.mockApi) {
    await delay(500);
    return {
      abstract_class: `# Generated HAL for ${instrumentName}\nclass ${instrumentName}HAL:\n    def __init__(self):\n        self.initialized = False\n\n    def initialize(self) -> bool:\n        self.initialized = True\n        return True`,
      api: `# Generated API for ${instrumentName}\nclass ${instrumentName}API:\n    def __init__(self):\n        self.hal = ${instrumentName}HAL()\n\n    def initialize(self) -> bool:\n        return self.hal.initialize()`
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instrument_name: instrumentName,
        stack
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate HAL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating HAL:', error);
    throw error;
  }
};

// Add HAL to library
export const addToLibrary = async (instrumentName: string, abstractClass: string) => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/library/${instrumentName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        abstract_class: abstractClass
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding to library:', error);
    throw error;
  }
};

// Download HAL
export const downloadHal = async (instrumentName: string, abstractClass: string) => {
  if (config.mockApi) {
    await delay(300);
    const content = `# HAL for ${instrumentName}\n\n${abstractClass}`;
    return new Blob([content], { type: 'text/plain' });
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/download/${instrumentName}/hal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        abstract_class: abstractClass
      })
    });

    if (!response.ok) {
      throw new Error('Failed to download HAL');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading HAL:', error);
    throw error;
  }
};

// Download API
export const downloadApi = async (instrumentName: string, api: string) => {
  if (config.mockApi) {
    await delay(300);
    const content = `# API for ${instrumentName}\n\n${api}`;
    return new Blob([content], { type: 'text/plain' });
  }

  try {
    const response = await fetch(`${BASE_URL}/hal/download/${instrumentName}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api
      })
    });

    if (!response.ok) {
      throw new Error('Failed to download API');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading API:', error);
    throw error;
  }
};

// Upload HAL
export const uploadHal = async (file: File) => {
  if (config.mockApi) {
    await delay(500);
    return {
      HAL: [file.name]
    };
  }

  try {
    const formData = new FormData();
    formData.append('hal_file', file);

    const response = await fetch(`${BASE_URL}/hal/upload_hal`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload HAL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading HAL:', error);
    throw error;
  }
};