# Use Python 3.10 slim image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY ./backend/requirements-deploy.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy only the backend directory (not the entire project)
WORKDIR /app/backend
COPY ./backend/requirements-deploy.txt ./requirements.txt
COPY ./backend/src ./src

# Expose port
EXPOSE $PORT

# Run the application
CMD ["sh", "-c", "python -m uvicorn src.main:app --host=0.0.0.0 --port $PORT"]