import React from 'react';
import AirdropButton from './AirdropButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {children}
      <AirdropButton />
    </div>
  );
};

export default MainLayout; 