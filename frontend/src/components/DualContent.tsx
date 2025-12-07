import React from 'react';
import { useLanguage } from '../contexts/LanguageProvider';
import { useDifficulty } from '../contexts/DifficultyProvider';

interface DualContentProps {
  children: {
    en: {
      beginner: React.ReactNode;
      advanced: React.ReactNode;
    };
    ur: {
      beginner: React.ReactNode;
      advanced: React.ReactNode;
    };
  };
  className?: string;
}

const DualContent: React.FC<DualContentProps> = ({ children, className = '' }) => {
  const { isUrdu } = useLanguage();
  const { difficulty } = useDifficulty();

  const content = isUrdu 
    ? (difficulty === 'beginner' 
        ? children.ur.beginner 
        : children.ur.advanced)
    : (difficulty === 'beginner' 
        ? children.en.beginner 
        : children.en.advanced);

  return (
    <div 
      className={className}
      dir={isUrdu ? 'rtl' : 'ltr'}
      style={{ 
        fontFamily: isUrdu ? '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Urdu Typesetting", serif' : 'inherit' 
      }}
    >
      {content}
    </div>
  );
};

export default DualContent;