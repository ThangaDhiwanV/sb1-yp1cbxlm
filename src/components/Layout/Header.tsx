import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#1a698b] text-white p-4 shadow-md">
      <h1 className="text-xl font-semibold text-center">{title}</h1>
    </header>
  );
};

export default Header;