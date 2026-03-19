# HCP CRM - AI-First Healthcare CRM

An AI-powered Customer Relationship Management (CRM) system designed for
Healthcare Professionals (HCPs). This platform helps pharma field teams log
interactions, analyze sentiment, and generate intelligent follow-ups using a
LangGraph-based AI agent with Groq LLM.

## Overview

This project upgrades a traditional CRM into an AI-driven workflow where user
inputs (form or chat) are processed by an LLM-powered agent to automate
interaction logging, record updates, and insight generation.

## Tech Stack

Frontend
- React.js
- Redux Toolkit

Backend
- FastAPI
- SQLAlchemy

AI Layer
- LangGraph
- Groq LLM

Database
- MySQL

## AI Agent Architecture

The system uses a LangGraph-based agent integrated with Groq LLM. Instead of
manual operations, the AI understands user intent and decides which tool to
execute.

### Agent Tools

- Log Interaction: Store HCP interaction details
- Edit Interaction: Update existing interaction records
- Interaction History Viewer: Retrieve past interactions
- Follow-up Suggestion: Recommend next actions
- Sentiment Analysis: Analyze interaction tone

## Workflow

User Input (Form/Chat) -> Groq LLM -> LangGraph Agent -> Tool Execution ->
Database -> Response

## Features

- Log HCP interactions via structured form
- Log interactions using natural language chat
- View complete interaction history
- AI-powered sentiment analysis
- Intelligent follow-up recommendations

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

API Docs:
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

## Key Highlight

This is not a traditional CRUD CRM. It is an AI-first system where an
LLM-driven agent dynamically selects actions, making the workflow more
intelligent and reducing manual effort.

## Author

Tipparam Sainath  
B.Tech CSE (Data Science)  
MLR Institute of Technology

## License

For academic/demo use.
