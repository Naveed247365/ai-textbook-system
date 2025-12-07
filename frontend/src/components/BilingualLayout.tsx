import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface BilingualLayoutProps {
  children: React.ReactNode;
  titleUrdu?: string;
  titleEnglish?: string;
}

const BilingualLayout: React.FC<BilingualLayoutProps> = ({ 
  children, 
  titleUrdu, 
  titleEnglish 
}) => {
  const { isUrdu } = useLanguage();
  
  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} style={{ 
      fontFamily: isUrdu ? '"Jameel Noori Nastaleeq", "Nafees Web Naskh", serif' : 'inherit',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {(titleUrdu || titleEnglish) && (
        <h1 style={{
          textAlign: isUrdu ? 'right' : 'left',
          direction: isUrdu ? 'rtl' : 'ltr',
          fontFamily: isUrdu ? '"Jameel Noori Nastaleeq", "Nafees Web Naskh", serif' : 'inherit',
          fontSize: isUrdu ? '2.2em' : '2em'
        }}>
          {isUrdu && titleUrdu ? titleUrdu : titleEnglish}
        </h1>
      )}
      <div style={{ 
        textAlign: isUrdu ? 'right' : 'left',
        direction: isUrdu ? 'rtl' : 'ltr',
        fontSize: isUrdu ? '1.1em' : '1em'
      }}>
        {children}
      </div>
    </div>
  );
};

export default BilingualLayout;