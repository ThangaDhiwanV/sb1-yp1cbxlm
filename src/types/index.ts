export interface Instrument {
  id: string;
  name: string;
  type: 'SMU' | 'DMM';
  driverCount?: number;
}

export interface Model {
  id: string;
  name: string;
  instrumentId: string;
  status: 'active' | 'offline';
  lastUpdated: string;
  createdDate: string;
  files: FileItem[];
}

export interface HalApi {
  id: string;
  instrumentId: string;
  files: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  type: 'driver' | 'manual' | 'Documentation' | 'api' | 'abstract';
  content: string;
  lastModified: string;
  author: string;
  version: string;
  allowedActions?: Array<'edit' | 'download' | 'view'>;
}

export type TabType = 'hal-api' | 'models';