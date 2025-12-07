# Quickstart: Full System Specification

This `quickstart.md` provides a high-level overview for setting up and running the Full System Specification locally. Detailed instructions will be provided in specific `README.md` files within the `backend/` and `frontend/` directories.

## Prerequisites

- Docker
- Python 3.10+
- Node.js (LTS) & npm
- Git

## Backend Setup (FastAPI)

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd ai_textbook
    git checkout 1-full-system-spec
    ```
2.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```
3.  **Build and run Docker containers (FastAPI & Qdrant)**:
    ```bash
    docker-compose up --build
    ```
    This will start the FastAPI server and a Qdrant instance. The FastAPI server will be accessible at `http://localhost:8000` (or as configured in `docker-compose.yml`).

## Frontend Setup (Docusaurus & React)

1.  **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start Docusaurus development server**:
    ```bash
    npm start
    ```
    The Docusaurus site will be available at `http://localhost:3000`.

## Initial Data Ingestion

After both backend and frontend are running, you will need to ingest the textbook chapters into the embedding pipeline. This can be done via the `/ingest` API endpoint. Refer to the `backend/README.md` for specific instructions on how to trigger the ingestion process.

## Next Steps

- Explore the Docusaurus frontend.
- Interact with the AI Chat Widget.
- Create a user profile and experiment with personalization.
- Test Urdu translation.
- Try out quizzes and labs.

For more detailed development and deployment instructions, refer to the respective `README.md` files in `backend/` and `frontend/`, and the API documentation generated in `specs/1-full-system-spec/contracts/`.
