export interface Project {
  id: string;
  name: string;
  modules: Module[];
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  type: string;
  driverCount: number;
  highlighted?: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  isActive: boolean;
}