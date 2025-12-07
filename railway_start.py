#!/usr/bin/env python3
"""
Railway-specific startup script
"""
import os
import sys
import logging
from backend.src.main import app
import uvicorn

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting application for Railway deployment...")

    # Get port from environment
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")

    # Run the application
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info",
        access_log=True,
        use_colors=True
    )