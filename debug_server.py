#!/usr/bin/env python3
"""
Minimal startup script for debugging
"""
import os
import sys
import logging
import subprocess

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    """Minimal startup to debug the issue"""
    try:
        logger.info("Starting minimal debug server...")
        logger.info(f"Current working directory: {os.getcwd()}")
        logger.info(f"Environment variables: PORT={os.environ.get('PORT', 'not set')}")

        # List files for debugging
        result = subprocess.run(['ls', '-la'], capture_output=True, text=True)
        logger.info(f"Files in /app: {result.stdout}")

        result = subprocess.run(['ls', '-la', '/app/backend/src'], capture_output=True, text=True)
        logger.info(f"Files in /app/backend/src: {result.stdout}")

        # Check if we can import basic modules
        logger.info("Testing basic imports...")

        # Import FastAPI and uvicorn first
        import fastapi
        import uvicorn
        logger.info("FastAPI and uvicorn imported successfully")

        # Create a minimal app first
        from fastapi import FastAPI
        app = FastAPI()

        @app.get("/")
        def read_root():
            return {"status": "minimal app running"}

        @app.get("/health")
        def health_check():
            return {"status": "healthy"}

        # Try to get the port
        port = int(os.environ.get("PORT", 8000))
        logger.info(f"Attempting to start server on port: {port}")

        # Start the minimal server
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            reload=False,
            log_level="info"
        )

    except Exception as e:
        logger.error(f"Error in minimal startup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()