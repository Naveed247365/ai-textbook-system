import React, { useState, useEffect } from 'react';

interface PersonalizationData {
  // Define structure for personalized data
  theme?: string;
  highlightKeywords?: string[];
}

interface PersonalizationRendererProps {
  content: string;
  userId: string; // Or a more complex user context
}

const fetchPersonalization = async (userId: string): Promise<PersonalizationData> => {
  // Placeholder for fetching personalization data from backend
  console.log(`Fetching personalization for user: ${userId}`);
  // In a real app, this would make an API call
  return {
    theme: userId === "user123" ? "dark" : "light",
    highlightKeywords: userId === "user123" ? ["AI", "Robotics"] : [],
  };
};

const applyPersonalization = (content: string, data: PersonalizationData): string => {
  let personalizedContent = content;

  // Example: Highlight keywords
  if (data.highlightKeywords) {
    data.highlightKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      personalizedContent = personalizedContent.replace(regex, `<span style="background-color: yellow;">$1</span>`);
    });
  }

  // Other personalization logic (e.g., theme application would be higher up in the component tree)
  return personalizedContent;
};

const PersonalizationRenderer: React.FC<PersonalizationRendererProps> = ({ content, userId }) => {
  const [personalizedContent, setPersonalizedContent] = useState<string>(content);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);

  useEffect(() => {
    fetchPersonalization(userId).then(data => {
      setPersonalizationData(data);
      setPersonalizedContent(applyPersonalization(content, data));
    });
  }, [content, userId]);

  // In a more complex scenario, theme might be applied to a higher-level div or context provider
  return <div className={personalizationData?.theme === "dark" ? "dark-theme" : ""} dangerouslySetInnerHTML={{ __html: personalizedContent }} />;
};

export default PersonalizationRenderer;
