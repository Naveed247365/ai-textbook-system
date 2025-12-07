#!/usr/bin/env python3
"""
Production start script for the Physical AI & Humanoid Robotics Textbook System
This script provides better error handling and logging for production deployment.
"""
import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """Start the FastAPI application using uvicorn with proper error handling"""
    try:
        # Add the project root and backend source to the Python path
        # In the Docker container, we're in /app directory
        sys.path.insert(0, "/app")
        sys.path.insert(0, "/app/backend/src")

        logger.info("Starting Physical AI & Humanoid Robotics Textbook System...")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"Python path: {sys.path[:3]}...")  # Show first few paths

        # List files in the current directory and backend/src for debugging
        import subprocess
        try:
            result = subprocess.run(['ls', '-la'], capture_output=True, text=True)
            logger.info(f"Files in /app: {result.stdout}")
        except:
            logger.info("Could not list files in /app")

        try:
            result = subprocess.run(['ls', '-la', '/app/backend/src'], capture_output=True, text=True)
            logger.info(f"Files in /app/backend/src: {result.stdout}")
        except:
            logger.info("Could not list files in /app/backend/src")

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
        logger.info("Attempting to import backend.src.main...")

        # Import the application
        from backend.src.main import app
        logger.info("Application imported successfully, starting server...")

        # Start the application
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            reload=False,  # Disable reload in production
            log_level="info",
            timeout_keep_alive=30,  # Increase keep-alive timeout
            access_log=True
        )

    except ImportError as e:
        logger.error(f"Import error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        logger.error(f"Application startup error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()