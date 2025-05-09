import { Instrument, Model, HalApi, FileItem } from '../types';

// Common content that can be reused
export const abstractClassContent = `from abc import ABC, abstractmethod

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

export const instruments: Instrument[] = [
  {
    id: '1',
    name: 'SMU',
    type: 'SMU',
    driverCount: 2,
    hasAbstractClass: true,
    hasApi: true,
    hasSoftPanel: true,
    documentation: true,
    hasDocs: true
  },
  {
    id: '2',
    name: 'DMM',
    type: 'DMM',
    driverCount: 1,
    hasAbstractClass: true,
    hasApi: true,
    hasSoftPanel: false,
    documentation: true,
    hasDocs: true
  },
  {
    id: '3',
    name: 'Power Supply',
    type: 'Power Supply',
    driverCount: 3,
    hasAbstractClass: true,
    hasApi: true,
    hasSoftPanel: true,
    documentation: true,
    hasDocs: true
  },
  {
    id: '4',
    name: 'Oscilloscope',
    type: 'Oscilloscope',
    driverCount: 2,
    hasAbstractClass: true,
    hasApi: true,
    hasSoftPanel: true,
    documentation: true,
    hasDocs: true
  }
];

export const models: Model[] = [
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
      }
    ]
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
      }
    ]
  }
];

export const mockHalApi: HalApi[] = [
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
    ]
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
      }
    ]
  }
];

// Mock HAL technology stacks
export const mockTechStacks = ['PyVISA', 'Serial', 'SCPI'];

// Mock HAL documents
export const mockHalDocs = ['Multimeter', 'Oscilloscope', 'PowerSupply'];

// Mock document content
export const mockDocumentContent = {
  'SCPI Manual': `SCPI Command Reference Manual
--------------------------------

1. Initialization Commands
   - *RST: Reset device to default state
   - *CLS: Clear status registers

2. Measurement Commands
   - MEASure:VOLTage?
   - MEASure:CURRent?

3. Configuration Commands
   - CONFigure:VOLTage
   - CONFigure:CURRent`,

  'IVI Manual': `IVI Driver Manual
---------------

1. Driver Overview
   - Initialization
   - Error handling
   - Resource management

2. API Reference
   - Initialize()
   - Configure()
   - Measure()`,

  'Programming Guide': `Instrument Programming Guide
-------------------------

1. Getting Started
   - Device connection
   - Basic measurements
   - Error handling

2. Advanced Features
   - Triggering
   - Data logging
   - System integration`,

  'User Manual': `Instrument User Manual
-------------------

1. Installation
   - Hardware setup
   - Software installation
   - Initial configuration

2. Operation
   - Basic measurements
   - Advanced features
   - Troubleshooting`
};