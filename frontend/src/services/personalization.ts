import { useState, useEffect } from 'react';

interface PersonalizationData {
  theme?: string;
  highlightKeywords?: string[];
  // Add other personalization fields as needed
}

export const fetchPersonalizationData = async (userId: string): Promise<PersonalizationData> => {
  // In a real application, this would make an API call to the backend's personalization endpoint
  console.log(`[Frontend Service] Fetching personalization data for user: ${userId}`);
  // Placeholder data for demonstration
  if (userId === "personalizedUser") {
    return {
      theme: "dark",
      highlightKeywords: ["Robotics", "AI Ethics"],
    };
  } else if (userId === "adminUser") {
      return {
          theme: "light",
          highlightKeywords: ["Deployment", "FastAPI"],
      };
  }
  return { theme: "light", highlightKeywords: [] };
};

export const applyPersonalizationToContent = (
  content: string,
  personalization: PersonalizationData
): string => {
  let processedContent = content;

  if (personalization.highlightKeywords && personalization.highlightKeywords.length > 0) {
    personalization.highlightKeywords.forEach(keyword => {
      // Using a more robust regex for whole word matching and case-insensitivity
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      processedContent = processedContent.replace(regex, `<span style="background-color: #ffd700; font-weight: bold;">$1</span>`);
    });
  }
  // Add more content personalization logic here if needed (e.g., reordering sections, filtering)
  return processedContent;
};

export const usePersonalizedContent = (content: string, userId: string): {
  displayContent: string;
  theme: string;
  personalizationLoading: boolean;
} => {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [displayContent, setDisplayContent] = useState<string>(content);
  const [personalizationLoading, setPersonalizationLoading] = useState<boolean>(true);

  useEffect(() => {
    setPersonalizationLoading(true);
    fetchPersonalizationData(userId)
      .then(data => {
        setPersonalizationData(data);
        setDisplayContent(applyPersonalizationToContent(content, data));
      })
      .finally(() => setPersonalizationLoading(false));
  }, [content, userId]);

  const theme = personalizationData?.theme || "light";

  return { displayContent, theme, personalizationLoading };
};
