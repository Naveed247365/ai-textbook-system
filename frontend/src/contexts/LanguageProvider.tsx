import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface LanguageContextType {
  isUrdu: boolean;
  toggleLanguage: () => void;
  currentLang: 'en' | 'ur';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [isUrdu, setIsUrdu] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'ur'>('en');

  useEffect(() => {
    // Initialize from localStorage
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const isUrduLang = savedLang === 'ur';
    setIsUrdu(isUrduLang);
    setCurrentLang(savedLang as 'en' | 'ur');
    document.documentElement.dir = isUrduLang ? 'rtl' : 'ltr';
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ur' : 'en';
    setIsUrdu(newLang === 'ur');
    setCurrentLang(newLang);
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.dir = newLang === 'ur' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ isUrdu, toggleLanguage, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};