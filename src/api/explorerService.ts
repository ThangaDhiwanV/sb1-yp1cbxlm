import { ExplorerResponse } from '../types';
import { config } from './config';
import { mockInstruments, mockModels } from './mockData';

const BASE_URL = config.apiBaseUrl;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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