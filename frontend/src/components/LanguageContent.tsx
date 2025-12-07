import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageContentProps {
  english: React.ReactNode;
  urdu: React.ReactNode;
  className?: string;
}

const LanguageContent: React.FC<LanguageContentProps> = ({ 
  english, 
  urdu,
  className = ''
}) => {
  const { isUrdu } = useLanguage();

  return (
    <div className={className}>
      {isUrdu ? urdu : english}
    </div>
  );
};

export default LanguageContent;