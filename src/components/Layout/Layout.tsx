import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { SidebarItem } from '../../types';

interface LayoutProps {
  children: ReactNode;
  title: string;
  sidebarItems: SidebarItem[];
  onSidebarItemClick: (itemId: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  sidebarItems,
  onSidebarItemClick
}) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} onItemClick={onSidebarItemClick} />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 bg-white">{children}</main>
      </div>
    </div>
  );
};

export default Layout;