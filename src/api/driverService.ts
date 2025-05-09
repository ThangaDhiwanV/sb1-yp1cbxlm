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
    const response = await fetch(`${BASE_URL}/driver/tech_stack`);
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

// Get available methods for a HAL class
export const getHalMethods = async (halClass: string): Promise<string[]> => {
  if (config.mockApi) {
    await delay(300);
    return ['Abort', 'Close', 'Initialize', 'MeasureVoltage', 'Reset', 'SourceCurrent'];
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/methods/${halClass}`);
    if (!response.ok) {
      throw new Error('Failed to fetch HAL methods');
    }
    const data = await response.json();
    return data.methods;
  } catch (error) {
    console.error('Error fetching HAL methods:', error);
    throw error;
  }
};

// Generate driver implementation
export const generateDriver = async (
  instrumentName: string,
  modelName: string,
  functions: string[],
  stack: string,
  manual: File
): Promise<string> => {
  if (config.mockApi) {
    await delay(500);
    return `# Generated Driver for ${modelName}\n# Technology: ${stack}\n\nclass ${modelName}:\n    def __init__(self):\n        pass\n\n    ${functions.join('\n    ')}`;
  }

  try {
    const formData = new FormData();
    formData.append('uploaded_manual', manual);
    formData.append('request', JSON.stringify({
      instrument_name: instrumentName,
      model_name: modelName,
      functions,
      stack
    }));

    const response = await fetch(`${BASE_URL}/driver/create`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to generate driver');
    }

    return await response.text();
  } catch (error) {
    console.error('Error generating driver:', error);
    throw error;
  }
};

// Add driver to library
export const addToLibrary = async (
  instrumentName: string,
  modelName: string,
  driver: string
): Promise<boolean> => {
  if (config.mockApi) {
    await delay(500);
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/library/${instrumentName}/model/${modelName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ driver })
    });

    return response.ok;
  } catch (error) {
    console.error('Error adding driver to library:', error);
    throw error;
  }
};

// Download driver
export const downloadDriver = async (
  instrumentName: string,
  modelName: string,
  driver: string
): Promise<Blob> => {
  if (config.mockApi) {
    await delay(300);
    return new Blob([driver], { type: 'application/x-zip-compressed' });
  }

  try {
    const response = await fetch(`${BASE_URL}/driver/download/${instrumentName}/model/${modelName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ driver })
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