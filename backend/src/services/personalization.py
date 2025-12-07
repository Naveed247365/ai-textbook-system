import re
from typing import Dict, Any

def get_user_personalization_data(user_id: str) -> Dict[str, Any]:
    """Fetches personalization data for a given user ID from a placeholder store.
    In a real application, this would query a database or cache for user preferences,
    learning history, or other personalization factors.
    """
    print(f"[Backend Service] Fetching personalization data for user: {user_id}")

    # Placeholder logic for demonstration
    if user_id == "personalizedUser":
        return {
            "theme": "dark",
            "highlight_keywords": ["Robotics", "AI Ethics"],
            "recommended_chapters": ["15-hri.md", "16-ethics-future-ai.md"]
        }
    elif user_id == "adminUser":
        return {
            "theme": "light",
            "highlight_keywords": ["Deployment", "FastAPI", "Qdrant"],
            "recommended_chapters": ["10-gazebo-sim.md", "11-isaac-sim.md"]
        }
    # Default personalization for other users
    return {
        "theme": "light",
        "highlight_keywords": [],
        "recommended_chapters": []
    }

def apply_personalization_to_chapter_content(content: str, personalization_data: Dict[str, Any]) -> str:
    """Applies personalization logic to chapter content.
    This could involve highlighting keywords, reordering sections, inserting custom notes, etc.
    """
    processed_content = content

    # Example: Highlight keywords
    highlight_keywords = personalization_data.get("highlight_keywords", [])
    for keyword in highlight_keywords:
        regex = r"\b(" + re.escape(keyword) + r")\b" # Use re.escape for safety
        processed_content = re.sub(regex, r"<span style=\"background-color: #ffd700; font-weight: bold;\">\1</span>", processed_content, flags=re.IGNORECASE)

    return processed_content
