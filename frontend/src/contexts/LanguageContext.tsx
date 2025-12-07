import React, { createContext, useContext, useEffect, useState } from 'react';

type LanguageContextType = {
  isUrdu: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: 'urdu' | 'english') => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUrdu, setIsUrdu] = useState(false);

  // Check for user's language preference in localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const isSavedUrdu = savedLanguage === 'urdu';
      setIsUrdu(isSavedUrdu);
      document.documentElement.dir = isSavedUrdu ? 'rtl' : 'ltr';
    } else {
      // Default to English
      setIsUrdu(false);
      document.documentElement.dir = 'ltr';
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = !isUrdu;
    setIsUrdu(newLanguage);
    // Save user preference
    localStorage.setItem('preferredLanguage', newLanguage ? 'urdu' : 'english');
    // Update direction for RTL languages
    document.documentElement.dir = newLanguage ? 'rtl' : 'ltr';
  };

  const setLanguage = (lang: 'urdu' | 'english') => {
    const newIsUrdu = lang === 'urdu';
    setIsUrdu(newIsUrdu);
    // Save user preference
    localStorage.setItem('preferredLanguage', lang);
    // Update direction for RTL languages
    document.documentElement.dir = newIsUrdu ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ isUrdu, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};