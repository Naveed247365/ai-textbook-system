import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface DifficultyContextType {
  difficulty: 'beginner' | 'advanced';
  toggleDifficulty: () => void;
  setDifficulty: (level: 'beginner' | 'advanced') => void;
}

const DifficultyContext = createContext<DifficultyContextType | undefined>(undefined);

interface DifficultyProviderProps {
  children: ReactNode;
}

export const DifficultyProvider: React.FC<DifficultyProviderProps> = ({ children }) => {
  const [difficulty, setDifficultyState] = useState<'beginner' | 'advanced'>('beginner');

  useEffect(() => {
    // Initialize from localStorage
    const savedDifficulty = localStorage.getItem('preferredDifficulty') || 'beginner';
    setDifficultyState(savedDifficulty as 'beginner' | 'advanced');
  }, []);

  const toggleDifficulty = () => {
    const newDifficulty = difficulty === 'beginner' ? 'advanced' : 'beginner';
    setDifficultyState(newDifficulty);
    localStorage.setItem('preferredDifficulty', newDifficulty);
  };

  const setDifficulty = (level: 'beginner' | 'advanced') => {
    setDifficultyState(level);
    localStorage.setItem('preferredDifficulty', level);
  };

  return (
    <DifficultyContext.Provider value={{ difficulty, toggleDifficulty, setDifficulty }}>
      {children}
    </DifficultyContext.Provider>
  );
};

export const useDifficulty = () => {
  const context = useContext(DifficultyContext);
  if (!context) {
    throw new Error('useDifficulty must be used within a DifficultyProvider');
  }
  return context;
};