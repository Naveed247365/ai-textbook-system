import React, { useEffect } from 'react';
import { LanguageProvider } from '../contexts/LanguageProvider';
import { DifficultyProvider } from '../contexts/DifficultyProvider';
import ChatWidget from './ChatWidget';
import UrduToggle from './UrduToggle';

const Root: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Any initialization code for the global component can go here
  }, []);

  return (
    <LanguageProvider>
      <DifficultyProvider>
        {children}
        <UrduToggle />
        <ChatWidget />
      </DifficultyProvider>
    </LanguageProvider>
  );
};

export default Root;