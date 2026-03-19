# HCP CRM - AI-First Healthcare CRM System

## Overview
An AI-powered Customer Relationship Management system for Healthcare Professionals (HCPs), built for pharmaceutical field representatives.

## Tech Stack
- **Frontend:** React.js + Redux
- **Backend:** Python + FastAPI
- **AI Agent:** LangGraph
- **LLM:** Groq (llama-3.3-70b-versatile)
- **Database:** MySQL

## Features
- Log HCP interactions via structured form or AI chat
- 5 LangGraph AI tools for sales activities
- Real-time sentiment analysis
- AI-powered follow-up suggestions

## LangGraph Tools
1. **Log Interaction** - Captures and saves HCP interaction data
2. **Edit Interaction** - Modify existing interaction records
3. **Get HCP History** - Retrieve past interactions for any HCP
4. **Suggest Follow-ups** - AI generates actionable follow-up steps
5. **Analyze Sentiment** - AI analyzes HCP sentiment from interaction

## Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables
Create `.env` file in backend folder:
```
GROQ_API_KEY=your_groq_api_key
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hcp_crm
```

## API Endpoints
- `POST /api/v1/log-interaction` - Log new interaction
- `POST /api/v1/chat` - Chat with AI agent
- `GET /api/v1/interactions` - Get all interactions
- `PUT /api/v1/edit-interaction/{id}` - Edit interaction
- `POST /api/v1/suggest-followups/{id}` - Get AI suggestions
- `POST /api/v1/analyze-sentiment/{id}` - Analyze sentiment

## Screenshots
Frontend runs on `http://localhost:3000`
API docs available at `http://localhost:8000/docs`