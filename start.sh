#!/usr/bin/env python3
"""
Production start script for the Physical AI & Humanoid Robotics Textbook System
"""
import os
import sys
from pathlib import Path

# Add the backend src directory to the Python path
backend_dir = Path(__file__).parent / "backend"
src_dir = backend_dir / "src"
sys.path.insert(0, str(src_dir))

def main():
    """Start the FastAPI application using uvicorn"""
    import uvicorn

    # Get port from environment or default to 8000
    port = int(os.environ.get("PORT", 8000))

    # Start the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    )

if __name__ == "__main__":
    main()