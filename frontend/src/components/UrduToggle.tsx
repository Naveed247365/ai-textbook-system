import React from 'react';
import { useLanguage } from '../contexts/LanguageProvider';
import { useDifficulty } from '../contexts/DifficultyProvider';

const UrduToggle: React.FC = () => {
  const { isUrdu, toggleLanguage } = useLanguage();
  const { difficulty, toggleDifficulty } = useDifficulty();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      gap: '10px'
    }}>
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        style={{
          backgroundColor: isUrdu ? '#ff6b35' : '#00c9a7',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          minWidth: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.opacity = '0.9';
          (e.target as HTMLElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <span style={{marginRight: '8px'}}>🌐</span>
        {isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
      </button>

      {/* Difficulty Toggle Button */}
      <button
        onClick={toggleDifficulty}
        style={{
          backgroundColor: difficulty === 'beginner' ? '#4a5568' : '#0059b3',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          minWidth: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.opacity = '0.9';
          (e.target as HTMLElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.opacity = '1';
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {difficulty === 'beginner' ? 'Switch to Advanced' : 'Switch to Beginner'}
      </button>
    </div>
  );
};

export default UrduToggle;
