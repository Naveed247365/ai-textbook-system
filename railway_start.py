#!/usr/bin/env python3
"""
Railway-specific startup script
"""
import os
import sys
import logging
import uvicorn

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the app after setting up the path
try:
    from backend.src.main import app
    logging.info("Successfully imported app from backend.src.main")
except ImportError as e:
    logging.error(f"Failed to import app from backend.src.main: {e}")
    # Try alternative import
    try:
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
        from src.main import app
        logging.info("Successfully imported app from src.main")
    except ImportError as e2:
        logging.error(f"Failed to import app from src.main: {e2}")
        # Try direct import
        try:
            sys.path.append(os.path.join(os.path.dirname(__file__)))
            from backend.src.main import app
            logging.info("Successfully imported app from backend.src.main using direct path")
        except ImportError as e3:
            logging.error(f"Failed to import app using all methods: {e3}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting application for Railway deployment...")

    # Get port from environment
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")

    # Run the application
    try:
        logger.info(f"Attempting to start server on 0.0.0.0:{port}")
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            reload=False,
            log_level="info",
            access_log=True,
            use_colors=False,  # Disable colors for Railway logs
            timeout_keep_alive=30  # Increase keep-alive timeout
        )
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)