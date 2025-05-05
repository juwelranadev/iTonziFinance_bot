import React from 'react';
import AirdropButton from './AirdropButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <main className="relative z-0">
        {children}
      </main>
      <div className="fixed bottom-0 right-0 z-[9999]">
        <AirdropButton />
      </div>
    </div>
  );
};

export default MainLayout; 