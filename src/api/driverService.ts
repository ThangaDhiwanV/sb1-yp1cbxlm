import { config } from './config';
import { delay } from '../utils/delay';

const BASE_URL = config.apiBaseUrl;

// Get available technology stacks
export const getTechStacks = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['Python', 'C++', 'LabVIEW'];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/tech_stack/`);
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

// Get available HAL classes
export const getHalClasses = async (): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['SMU', 'DMM', 'AIO', 'DIO', 'Audio', 'Electronic_Load', 'Network'];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/hal-classes`);
    if (!response.ok) {
      throw new Error('Failed to fetch HAL classes');
    }
    const data = await response.json();
    return data.classes;
  } catch (error) {
    console.error('Error fetching HAL classes:', error);
    throw error;
  }
};

// Generate driver implementation
export const generateDriver = async (params: {
  instrumentName: string;
  modelName: string;
  functions: string[];
  stack: string;
  manual?: File;
}) => {
  if (config.mockApi) {
    await delay(500);
    return {
      driver: `// Generated Driver for ${params.modelName}\nclass ${params.modelName}Driver {\n  constructor() {\n    this.initialized = false;\n  }\n\n  ${params.functions.join('\n\n  ')}\n}`,
      abstractClass: `abstract class ${params.instrumentName}Driver {\n  abstract initialize(): Promise<boolean>;\n  abstract reset(): Promise<void>;\n  abstract selfTest(): Promise<[boolean, string]>;\n}`
    };
  }

  try {
    const formData = new FormData();
    formData.append('instrument_name', params.instrumentName);
    formData.append('model_name', params.modelName);
    formData.append('functions', JSON.stringify(params.functions));
    formData.append('stack', params.stack);
    if (params.manual) {
      formData.append('uploaded_manual', params.manual);
    }

    const response = await fetch(`${BASE_URL}/driver/create`, {
      method: 'POST',
      body: formData
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

// Get available methods for a HAL class
export const getHalMethods = async (halClass: string): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['Abort', 'Close', 'Initialize', 'MeasureVoltage', 'Reset', 'SourceCurrent'];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/methods/${halClass}`);
    if (!response.ok) {
      throw new Error('Failed to fetch methods');
    }
    const data = await response.json();
    return data.methods;
  } catch (error) {
    console.error('Error fetching methods:', error);
    throw error;
  }
};

// Add driver to library
export const addToLibrary = async (params: {
  instrumentName: string;
  modelName: string;
  driver: string;
}) => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/library/${params.instrumentName}/model/${params.modelName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        driver: params.driver
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding to library:', error);
    throw error;
  }
};

// Download driver
export const downloadDriver = async (params: {
  instrumentName: string;
  modelName: string;
  driver: string;
}) => {
  if (config.mockApi) {
    await delay(300);
    const content = `// Driver for ${params.modelName}\n\n${params.driver}`;
    return new Blob([content], { type: 'text/plain' });
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/download/${params.instrumentName}/model/${params.modelName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        driver: params.driver
      })
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