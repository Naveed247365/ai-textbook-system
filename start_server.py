#!/usr/bin/env python3
"""
Production start script for the Physical AI & Humanoid Robotics Textbook System
This script provides better error handling and logging for production deployment.
"""
import os
import sys
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """Start the FastAPI application using uvicorn with proper error handling"""
    try:
        # Add the project root directory to the Python path
        project_root = Path(__file__).parent
        backend_src = project_root / "backend" / "src"
        sys.path.insert(0, str(project_root))
        sys.path.insert(0, str(backend_src))

        logger.info("Starting Physical AI & Humanoid Robotics Textbook System...")
        logger.info(f"Python path: {sys.path[:3]}...")  # Show first few paths

        # Get port from environment or default to 8000
        port = int(os.environ.get("PORT", 8000))
        logger.info(f"Using port: {port}")

        # Check for required environment variables
        required_vars = ["GEMINI_API_KEY", "QDRANT_API_KEY", "QDRANT_URL", "DATABASE_URL", "SECRET_KEY"]
        for var in required_vars:
            if not os.getenv(var):
                logger.warning(f"Warning: Environment variable {var} is not set")
            else:
                logger.info(f"Environment variable {var} is set")

        # Import and start the application
        import uvicorn
        from backend.src.main import app

        logger.info("Application imported successfully, starting server...")

        # Start the application
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            reload=False,  # Disable reload in production
            log_level="info",
            timeout_keep_alive=30  # Increase keep-alive timeout
        )

    except ImportError as e:
        logger.error(f"Import error: {e}")
        logger.error("Available modules in backend/src:")
        backend_src = Path(__file__).parent / "backend" / "src"
        if backend_src.exists():
            for py_file in backend_src.glob("*.py"):
                logger.error(f"  - {py_file.name}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Application startup error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()