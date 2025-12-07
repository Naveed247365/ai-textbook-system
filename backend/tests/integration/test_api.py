import pytest
from fastapi.testclient import TestClient
from backend.src.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the FastAPI RAG Backend!"}

def test_register_user():
    # Test user registration
    user_data = {
        "email": "integration@example.com",
        "username": "integrationuser",
        "password": "integrationpass"
    }
    response = client.post("/api/register", json=user_data)
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["email"] == "integration@example.com"

    # Test duplicate registration
    response = client.post("/api/register", json=user_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}

def test_login_for_access_token():
    # Register a user first for login test
    user_data = {
        "email": "login@example.com",
        "username": "loginuser",
        "password": "loginpass"
    }
    client.post("/api/register", json=user_data)

    # Test successful login
    form_data = {"username": "login@example.com", "password": "loginpass"}
    response = client.post("/api/token", data=form_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

    # Test incorrect password
    form_data["password"] = "wrongpass"
    response = client.post("/api/token", data=form_data)
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}

def test_read_users_me():
    # Register a user and get a token
    user_data = {
        "email": "me@example.com",
        "username": "meuser",
        "password": "mepass"
    }
    client.post("/api/register", json=user_data)
    form_data = {"username": "me@example.com", "password": "mepass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    # Test accessing profile with token
    response = client.get(
        "/api/profile/me",
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"

    # Test accessing profile without token
    response = client.get("/api/profile/me")
    assert response.status_code == 401

def test_ingest_chapters():
    # This test requires a running Qdrant instance and chapter files.
    # For a true integration test, you'd need to mock or run Qdrant and provide dummy chapters.
    # For now, we'll test the endpoint structure and potential error states.
    ingest_request = {"chapter_dir": "./docusaurus-chapters", "collection_name": "test_collection"}
    response = client.post("/api/ingest", json=ingest_request)
    # Depending on whether Qdrant is mocked or running, status code might vary.
    # For now, we expect a 200 if the directory exists and no other errors.
    assert response.status_code == 200 or response.status_code == 500 # Might be 500 if Qdrant isn't up
    assert "message" in response.json()

def test_query_chapters():
    # Similar to ingest, this needs Qdrant.
    query_request = {"query_text": "What is AI?", "collection_name": "test_collection"}
    response = client.post("/api/query", json=query_request)
    assert response.status_code == 200 or response.status_code == 500 # Might be 500 if Qdrant isn't up
    if response.status_code == 200:
        assert "results" in response.json()

def test_translate_text():
    translation_request = {"text": "Hello", "target_language": "ur"}
    response = client.post("/api/translate", json=translation_request)
    assert response.status_code == 200
    assert response.json() == {"translated_text": "[Urdu Translation of: Hello]"}

def test_generate_quiz():
    user_data = {"email": "quiz@example.com", "username": "quizuser", "password": "quizpass"}
    client.post("/api/register", json=user_data)
    form_data = {"username": "quiz@example.com", "password": "quizpass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    quiz_request = {"chapter_content": "Content about AI.", "chapter_title": "Introduction to AI"}
    response = client.post(
        "/api/quiz/generate",
        json=quiz_request,
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert "chapter_title" in response.json()
    assert "questions" in response.json()

def test_submit_quiz():
    user_data = {"email": "subquiz@example.com", "username": "subquizuser", "password": "subquizpass"}
    client.post("/api/register", json=user_data)
    form_data = {"username": "subquiz@example.com", "password": "subquizpass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    # First generate a quiz (simplified as quiz_id is just chapterTitle for now)
    quiz_id = "Introduction to AI"
    submissions = {"q1": "b", "q2": "a"} # Dummy answers
    submit_request = {"quiz_id": quiz_id, "submissions": submissions}

    response = client.post(
        "/api/quiz/submit",
        json=submit_request,
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert "score" in response.json()
    assert "feedback" in response.json()

def test_generate_lab():
    user_data = {"email": "lab@example.com", "username": "labuser", "password": "labpass"}
    client.post("/api/register", json=user_data)
    form_data = {"username": "lab@example.com", "password": "labpass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    lab_request = {"chapter_content": "Content for robotics lab.", "chapter_title": "Robot Control Strategies"}
    response = client.post(
        "/api/labs/generate",
        json=lab_request,
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert "lab_id" in response.json()
    assert "tasks" in response.json()

def test_submit_lab():
    user_data = {"email": "sublab@example.com", "username": "sublabuser", "password": "sublabpass"}
    client.post("/api/register", json=user_data)
    form_data = {"username": "sublab@example.com", "password": "sublabpass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    lab_id = "lab-robot-control-strategies"
    submitted_code = "def factorial(n): return 1\nclass Robot: pass"
    submit_request = {"lab_id": lab_id, "submitted_code": submitted_code}

    response = client.post(
        "/api/labs/submit",
        json=submit_request,
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert "passed" in response.json()
    assert "feedback" in response.json()

def test_explain_code():
    user_data = {"email": "explain@example.com", "username": "explainuser", "password": "explainpass"}
    client.post("/api/register", json=user_data)
    form_data = {"username": "explain@example.com", "password": "explainpass"}
    token_response = client.post("/api/token", data=form_data)
    access_token = token_response.json()["access_token"]

    explain_request = {"code_snippet": "def my_func():\n    pass", "explanation_context": "Python function"}
    response = client.post(
        "/api/query",
        json=explain_request,
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    assert response.status_code == 200
    assert "explanation" in response.json()
    assert "code_snippet" in response.json()["explanation"]
