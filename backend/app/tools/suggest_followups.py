from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.database import SessionLocal
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(api_key=os.getenv("GROQ_API_KEY"), model="llama-3.3-70b-versatile")

def suggest_followups(interaction_id: int) -> dict:
    db = SessionLocal()
    try:
        interaction = db.execute(
            text("""
                SELECT i.interaction_type, i.topics_discussed, i.outcomes, 
                       i.sentiment, h.name, h.specialty
                FROM interactions i
                JOIN hcps h ON i.hcp_id = h.id
                WHERE i.id = :id
            """),
            {"id": interaction_id}
        ).fetchone()

        if not interaction:
            return {"success": False, "message": f"Interaction {interaction_id} not found"}

        prompt = f"""You are a pharmaceutical sales assistant. Based on this HCP interaction, suggest 3 specific follow-up actions.

HCP Name: {interaction[4]}
Specialty: {interaction[5]}
Interaction Type: {interaction[0]}
Topics Discussed: {interaction[1]}
Outcomes: {interaction[2]}
Sentiment: {interaction[3]}

Provide exactly 3 follow-up suggestions as a numbered list. Be specific and actionable."""

        response = llm.invoke([HumanMessage(content=prompt)])
        suggestions = response.content.strip()

        db.execute(
            text("UPDATE interactions SET follow_up_actions = :followup WHERE id = :id"),
            {"followup": suggestions, "id": interaction_id}
        )
        db.commit()

        return {
            "success": True,
            "interaction_id": interaction_id,
            "hcp_name": interaction[4],
            "suggestions": suggestions
        }
    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}
    finally:
        db.close()
