import React from 'react';
import { SidebarItem } from '../../types';

interface SidebarProps {
  items: SidebarItem[];
  onItemClick: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onItemClick }) => {
  return (
    <aside className="bg-[#1a698b] w-20 min-h-screen flex flex-col">
      {items.map((item) => (
        <button
          key={item.id}
          className={`sidebar-item ${item.isActive ? 'active' : ''}`}
          onClick={() => onItemClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;