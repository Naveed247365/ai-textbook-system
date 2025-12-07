# Use an official Python runtime as a parent image
FROM python:3.10-slim-buster

# Set the working directory in the container
WORKDIR /app/backend

# Install poetry
RUN pip install poetry

# Copy the backend code into the container
COPY ./backend .

# Install dependencies
RUN poetry install --no-root --no-dev

# Expose port 8000 for the FastAPI application
EXPOSE 8000

# Run the application using Uvicorn
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
