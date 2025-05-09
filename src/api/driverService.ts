import { config } from './config';
import { delay } from '../utils/delay';

const BASE_URL = config.apiBaseUrl;

// Get available technology stacks
export const getDriverTechStacks = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['Python', 'TypeScript', 'C++', 'Java'];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/tech_stack`);
    if (!response.ok) {
      throw new Error('Failed to fetch technology stacks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    throw error;
  }
};

// Get available functions for a driver
export const getDriverFunctions = async (instrumentType: string): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return [
      'initialize()',
      'reset()',
      'selfTest()',
      'connect()',
      'disconnect()',
      'measure()',
      'configure()',
      'calibrate()',
    ];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/functions/${instrumentType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver functions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching driver functions:', error);
    throw error;
  }
};

// Generate driver implementation
export const generateDriver = async (params: {
  instrumentType: string;
  modelName: string;
  technology: string;
  functions: string[];
}) => {
  if (config.mockApi) {
    await delay(500);
    return {
      driver: `// Generated Driver for ${params.modelName}
class ${params.modelName}Driver {
  constructor() {
    this.connected = false;
  }

  ${params.functions.join('\n\n  ')}
}`,
      abstractClass: `abstract class ${params.instrumentType}Driver {
  abstract initialize(): Promise<boolean>;
  abstract reset(): Promise<void>;
  abstract selfTest(): Promise<[boolean, string]>;
}`
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error('Failed to generate driver');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating driver:', error);
    throw error;
  }
};

// Add driver to library
export const addDriverToLibrary = async (params: {
  instrumentType: string;
  modelName: string;
  driver: string;
  abstractClass: string;
}) => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/library`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding driver to library:', error);
    throw error;
  }
};

// Download driver
export const downloadDriver = async (params: {
  instrumentType: string;
  modelName: string;
  driver: string;
}) => {
  if (config.mockApi) {
    await delay(300);
    return new Blob([params.driver], { type: 'text/plain' });
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error('Failed to download driver');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading driver:', error);
    throw error;
  }
};

// Upload driver
export const uploadDriver = async (file: File) => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const formData = new FormData();
    formData.append('driver_file', file);

    const response = await fetch(`${BASE_URL}/driver/upload`, {
      method: 'POST',
      body: formData
    });

    return response.ok;
  } catch (error) {
    console.error('Error uploading driver:', error);
    throw error;
  }
};