import { config } from './config';
import { delay } from '../utils/delay';

const BASE_URL = config.apiBaseUrl;

// Get available technology stacks
export const getTechStacks = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/hal/tech_stack/`);
    if (!response.ok) {
      throw new Error('Failed to fetch technology stacks');
    }
    const data = await response.json();
    return data.types;
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    // Fallback to mock data if API fails
    await delay(300);
    return ['PyVISA', 'Serial', 'SCPI'];
  }
};

// Get available HAL documents
export const getHalDocs = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/hal/hal_docs`);
    if (!response.ok) {
      throw new Error('Failed to fetch HAL documents');
    }
    const data = await response.json();
    return data.HAL;
  } catch (error) {
    console.error('Error fetching HAL docs:', error);
    // Fallback to mock data if API fails
    await delay(300);
    return ['Multimeter', 'Oscilloscope', 'PowerSupply'];
  }
};

// Generate HAL implementation
export const generateHal = async (instrumentName: string, stack: string) => {
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
};

// Add HAL to library
export const addToLibrary = async (instrumentName: string, abstractClass: string) => {
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
};

// Download HAL
export const downloadHal = async (instrumentName: string, abstractClass: string) => {
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
};

// Download API
export const downloadApi = async (instrumentName: string, api: string) => {
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
};

// Upload HAL
export const uploadHal = async (file: File) => {
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
};