# Use Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH=/app:/app/backend

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY backend/requirements-deploy.txt /app/backend/requirements-deploy.txt

# Install Python dependencies
RUN mkdir -p /app/backend && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements-deploy.txt

# Copy the entire backend directory to maintain proper structure
COPY backend ./backend

# Copy the startup scripts
COPY start_server.py /app/start_server.py
COPY railway_start.py /app/railway_start.py

# Expose port - Railway will override this with the PORT environment variable
EXPOSE 8000

# Create a simple shell script to run the application
RUN echo '#!/bin/bash\nset -e\npython /app/railway_start.py' > /app/start.sh && chmod +x /app/start.sh

# Run the application using the shell script
ENTRYPOINT ["/app/start.sh"]