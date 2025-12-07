import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

// Component for language toggle in the sidebar
const SidebarLanguageToggle = () => {
  const [isUrdu, setIsUrdu] = useState(false);
  const location = useLocation();

  // Check for user's language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'english';
    setIsUrdu(savedLanguage === 'urdu');
  }, [location.pathname]); // Re-run when route changes

  const toggleLanguage = () => {
    const newLanguage = !isUrdu;
    setIsUrdu(newLanguage);
    // Save user preference
    localStorage.setItem('preferredLanguage', newLanguage ? 'urdu' : 'english');
    // Update direction for RTL languages
    document.documentElement.dir = newLanguage ? 'rtl' : 'ltr';
    
    // Trigger a custom event that other components can listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { isUrdu: newLanguage } }));
  };

  return (
    <div className="sidebar-language-toggle" style={{
      padding: '10px',
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '15px'
    }}>
      <button 
        onClick={toggleLanguage}
        style={{
          backgroundColor: isUrdu ? '#ff6b35' : '#00c9a7',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          width: '100%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.opacity = '1';
        }}
      >
        <span style={{marginRight: '5px'}}>🌐</span>
        {isUrdu ? 'Switch to English' : 'اردو میں تبدیل کریں'}
      </button>
    </div>
  );
};

export default SidebarLanguageToggle;