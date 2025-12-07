import { useState, useEffect } from 'react';

interface TranslationResponse {
  translated_text: string;
}

export const fetchTranslation = async (text: string, target_language: string): Promise<string> => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, target_language }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TranslationResponse = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error("Error fetching translation:", error);
    return text; // Return original text on error
  }
};

export const useTranslatedContent = (content: string, isUrdu: boolean): string => {
  const [translatedContent, setTranslatedContent] = useState<string>(content);

  useEffect(() => {
    if (isUrdu) {
      fetchTranslation(content, 'ur').then(setTranslatedContent);
    } else {
      setTranslatedContent(content);
    }
  }, [content, isUrdu]);

  return translatedContent;
};
