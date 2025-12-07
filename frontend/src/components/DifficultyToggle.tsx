import React, { useEffect, useState } from 'react';

// Component for difficulty toggle that can be placed in UI
const DifficultyToggle = () => {
  const [difficulty, setDifficulty] = useState<'beginner' | 'advanced'>('beginner');

  // Check for user's difficulty preference on component mount
  useEffect(() => {
    const savedDifficulty = localStorage.getItem('preferredDifficulty') || 'beginner';
    setDifficulty(savedDifficulty as 'beginner' | 'advanced');
  }, []);

  const toggleDifficulty = () => {
    const newDifficulty = difficulty === 'beginner' ? 'advanced' : 'beginner';
    setDifficulty(newDifficulty);
    // Save user preference
    localStorage.setItem('preferredDifficulty', newDifficulty);
    
    // Trigger a custom event that other components can listen to
    window.dispatchEvent(new CustomEvent('difficultyChanged', { 
      detail: { difficulty: newDifficulty } 
    }));
  };

  return (
    <div style={{
      padding: '5px 10px',
      borderRadius: '4px',
      backgroundColor: '#f0f0f0',
      display: 'inline-block',
      fontSize: '14px',
      marginLeft: '10px'
    }}>
      <button 
        onClick={toggleDifficulty}
        style={{
          backgroundColor: '#4a5568',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {difficulty === 'beginner' ? 'Switch to Advanced' : 'Switch to Beginner'}
      </button>
    </div>
  );
};

export default DifficultyToggle;