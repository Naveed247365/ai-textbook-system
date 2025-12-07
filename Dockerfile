# Use Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH=/app

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

# Copy only the backend source (not the entire project)
COPY backend/src ./backend/src

# Copy the startup script
COPY start_server.py /app/start_server.py

# Expose port
EXPOSE $PORT

# Run the application
CMD ["python", "/app/start_server.py"]