import { Project, SidebarItem } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    modules: [
      {
        id: 'm1',
        name: 'SMU',
        icon: 'SMU Icon',
        type: 'SMU',
        driverCount: 5,
        highlighted: true
      },
      {
        id: 'm2',
        name: 'DMM',
        icon: 'DMM Icon',
        type: 'DMM',
        driverCount: 3
      },
      {
        id: 'm3',
        name: 'DMM 2',
        icon: 'DMM Icon',
        type: 'DMM',
        driverCount: 4
      },
      {
        id: 'm4',
        name: 'Empty Module 1',
        icon: '',
        type: '',
        driverCount: 0
      },
      {
        id: 'm5',
        name: 'Empty Module 2',
        icon: '',
        type: '',
        driverCount: 0
      },
      {
        id: 'm6',
        name: 'Empty Module 3',
        icon: '',
        type: '',
        driverCount: 0
      }
    ]
  },
  {
    id: '2',
    name: 'Project 2',
    modules: []
  },
  {
    id: '3',
    name: 'Project 3',
    modules: []
  },
  {
    id: '4',
    name: 'Project 4',
    modules: []
  }
];

export const sidebarItems: SidebarItem[] = [
  {
    id: 'proj',
    label: 'Proj',
    isActive: false
  },
  {
    id: 'vb',
    label: 'VB',
    isActive: false
  },
  {
    id: 'mac',
    label: 'Mac',
    isActive: false
  },
  {
    id: 'all-inst',
    label: 'All Inst',
    isActive: true
  }
];