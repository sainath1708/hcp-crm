from fastapi import APIRouter
from app.models.schemas import (
    ChatMessage,
    InteractionCreate,
    InteractionUpdate,
)
from app.agents.hcp_agent import run_agent
from app.tools.log_interaction import log_interaction, extract_interaction_data
from app.tools.edit_interaction import edit_interaction
from app.tools.get_hcp_history import get_hcp_history
from app.tools.suggest_followups import suggest_followups
from app.tools.analyze_sentiment import analyze_sentiment

router = APIRouter()


@router.post("/chat")
def chat_with_agent(payload: ChatMessage):
    try:
        response = run_agent(payload.message)
        return {"success": True, "response": response}
    except Exception as e:
        return {
            "success": False,
            "response": (
                "AI assistant is temporarily unavailable. "
                "Please try again."
            ),
            "message": str(e)
        }


@router.post("/log-interaction")
def log_interaction_route(payload: InteractionCreate):
    data = payload.dict()
    result = log_interaction(data)
    return result


@router.post("/log-interaction-from-chat")
def log_from_chat(payload: ChatMessage):
    try:
        extracted = extract_interaction_data(payload.message)
        result = log_interaction(extracted)
        return {
            "success": result["success"],
            "message": result["message"],
            "extracted": extracted,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to process chat interaction: {str(e)}",
            "extracted": None
        }


@router.put("/edit-interaction/{interaction_id}")
def edit_interaction_route(interaction_id: int, payload: InteractionUpdate):
    result = edit_interaction(interaction_id, payload.dict())
    return result


@router.get("/hcp-history/{hcp_name}")
def get_history(hcp_name: str):
    result = get_hcp_history(hcp_name)
    return result


@router.post("/suggest-followups/{interaction_id}")
def suggest_followups_route(interaction_id: int):
    result = suggest_followups(interaction_id)
    return result


@router.post("/analyze-sentiment/{interaction_id}")
def analyze_sentiment_route(interaction_id: int):
    result = analyze_sentiment(interaction_id)
    return result


@router.get("/interactions")
def get_all_interactions():
    from app.database import SessionLocal
    from sqlalchemy import text
    db = SessionLocal()

    try:
        rows = db.execute(text("""
            SELECT i.id, h.name, i.interaction_type, i.date,
                   i.time, i.topics_discussed, i.outcomes,
                   i.sentiment, i.follow_up_actions, i.ai_summary
            FROM interactions i
            JOIN hcps h ON i.hcp_id = h.id
            ORDER BY i.date DESC
        """)).fetchall()

        interactions = []
        for r in rows:
            interactions.append({
                "id": r[0],
                "hcp_name": r[1],
                "interaction_type": r[2],
                "date": str(r[3]),
                "time": str(r[4]),
                "topics_discussed": r[5],
                "outcomes": r[6],
                "sentiment": r[7],
                "follow_up_actions": r[8],
                "ai_summary": r[9]
            })
        return {"success": True, "interactions": interactions}
    except Exception as e:
        return {"success": False, "message": str(e)}
    finally:
        db.close()
