export interface Instrument {
  id: string;
  name: string;
  type: string;  // Changed from 'SMU' | 'DMM' to allow more instrument types
  driverCount?: number;
  hasAbstractClass?: boolean;
  hasDocs?: boolean;
  hasSoftPanel?: boolean;
  hasApi?: boolean;
  documentation?: boolean;
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
  type: 'driver' | 'manual' | 'Documentation' | 'api' | 'abstract' | 'panel';
  content: string;
  lastModified: string;
  author: string;
  version: string;
  allowedActions?: Array<'edit' | 'download' | 'view'>;
}

export type TabType = 'hal-api' | 'models';

export interface PaginationParams {
  page: number;
  pageSize: number;
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ModelCapabilities {
  panel: boolean;
  manual: boolean;
  driver: boolean;
}

export interface InstrumentModel {
  [key: string]: ModelCapabilities;
}

export interface InstrumentCapabilities {
  hal: boolean;
  documentation: boolean;
  panel: boolean;
  api: boolean;
  models: InstrumentModel[];
}

export interface ExplorerResponse {
  [key: string]: InstrumentCapabilities;
}

export interface DriverGenerationRequest {
  instrument_name: string;
  model_name: string;
  functions: string[];
  stack: string;
}

export interface DriverResponse {
  driver: string;
  message?: string;
}

export interface TechStackResponse {
  types: string[];
}

export interface HalClassesResponse {
  classes: string[];
}

export interface MethodsResponse {
  methods: string[];
}