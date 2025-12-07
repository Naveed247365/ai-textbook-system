import os
import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any
import google.generativeai as genai

# This would be integrated with actual Google AI services
class AITranslationAdapter(ABC):
    """Abstract interface for AI translation services (Google Gemini)"""

    @abstractmethod
    async def translate(self, text: str, source_lang: str, target_lang: str, difficulty: str = "beginner") -> str:
        """Translate text using the AI service"""
        pass


class GeminiTranslationAdapter(AITranslationAdapter):
    """Adapter for Google Gemini translation API"""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')  # or another appropriate model
        else:
            self.model = None

    async def translate(self, text: str, source_lang: str, target_lang: str, difficulty: str = "beginner") -> str:
        """Translate text using Google Gemini"""
        if not self.model:
            return f"[GEMINI API KEY MISSING: {text[:30]}...]"

        try:
            # Format the prompt based on difficulty level
            if difficulty == "beginner":
                prompt = f"""
                Translate the following text from {source_lang} to {target_lang}.
                For beginner level, use simple vocabulary and shorter sentences.

                Text to translate: {text}

                Translation:
                """
            else:  # advanced
                prompt = f"""
                Translate the following text from {source_lang} to {target_lang}.
                For advanced level, use technical terminology where appropriate and maintain nuance.

                Text to translate: {text}

                Translation:
                """

            # Call the Gemini API
            response = await self.model.generate_content_async(prompt)
            return response.text.strip()

        except Exception as e:
            # Fallback response if API call fails
            return f"[TRANSLATION ERROR: {str(e)}. Original: {text[:30]}...]"


class TranslationAdapterManager:
    """Manages Google AI translation services"""

    def __init__(self):
        self.adapters: Dict[str, AITranslationAdapter] = {
            "gemini": GeminiTranslationAdapter(),
        }

    async def translate(self, text: str, source_lang: str, target_lang: str,
                       difficulty: str = "beginner", service: str = "gemini") -> str:
        """Translate text using the specified AI service"""
        if service not in self.adapters:
            raise ValueError(f"Unsupported translation service: {service}")

        adapter = self.adapters[service]
        return await adapter.translate(text, source_lang, target_lang, difficulty)

    def get_available_services(self) -> list:
        """Return list of available translation services"""
        return list(self.adapters.keys())


# Singleton instance
translation_adapter_manager = TranslationAdapterManager()