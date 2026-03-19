from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.database import SessionLocal
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(api_key=os.getenv("GROQ_API_KEY"), model="llama-3.3-70b-versatile")

def analyze_sentiment(interaction_id: int) -> dict:
    db = SessionLocal()
    try:
        interaction = db.execute(
            text("""
                SELECT i.topics_discussed, i.outcomes, i.follow_up_actions,
                       h.name, h.specialty
                FROM interactions i
                JOIN hcps h ON i.hcp_id = h.id
                WHERE i.id = :id
            """),
            {"id": interaction_id}
        ).fetchone()

        if not interaction:
            return {"success": False, "message": f"Interaction {interaction_id} not found"}

        prompt = f"""Analyze the sentiment of this HCP interaction and provide:
1. Overall sentiment: (Positive/Neutral/Negative)
2. Confidence score: (0-100)
3. Key reasons for this sentiment
4. Recommendations for next interaction

HCP Name: {interaction[3]}
Specialty: {interaction[4]}
Topics Discussed: {interaction[0]}
Outcomes: {interaction[1]}
Follow Up Actions: {interaction[2]}

Be concise and professional."""

        response = llm.invoke([HumanMessage(content=prompt)])
        analysis = response.content.strip()

        sentiment = "Neutral"
        if "positive" in analysis.lower():
            sentiment = "Positive"
        elif "negative" in analysis.lower():
            sentiment = "Negative"

        db.execute(
            text("UPDATE interactions SET sentiment = :sentiment WHERE id = :id"),
            {"sentiment": sentiment, "id": interaction_id}
        )
        db.commit()

        return {
            "success": True,
            "interaction_id": interaction_id,
            "hcp_name": interaction[3],
            "sentiment": sentiment,
            "analysis": analysis
        }
    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}
    finally:
        db.close()
