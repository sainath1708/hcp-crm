# HCP CRM - AI-First Healthcare CRM

AI-powered Customer Relationship Management (CRM) system for Healthcare
Professionals (HCPs), designed for pharma field teams to log interactions,
analyze sentiment, and generate follow-up actions.

## Tech Stack

- Frontend: React, Redux Toolkit
- Backend: FastAPI, SQLAlchemy
- AI: LangGraph + Groq
- Database: MySQL

## Core Features

- Log HCP interactions from a structured form
- Log interactions from natural language chat
- View interaction history
- Analyze sentiment for interactions
- Generate AI follow-up suggestions

## Project Structure

```text
AIVOA/
	backend/
		app/
			agents/
			models/
			routers/
			tools/
	frontend/
		src/
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs:

- http://localhost:8000/docs

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

If port 3000 is busy:

```bash
set PORT=3100 && npm start
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_groq_api_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hcp_crm
```

## Main API Endpoints

- `POST /api/v1/chat`
- `POST /api/v1/log-interaction`
- `POST /api/v1/log-interaction-from-chat`
- `GET /api/v1/interactions`
- `PUT /api/v1/edit-interaction/{interaction_id}`
- `POST /api/v1/suggest-followups/{interaction_id}`
- `POST /api/v1/analyze-sentiment/{interaction_id}`

## License

For academic/demo use.
