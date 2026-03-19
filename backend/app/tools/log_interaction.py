from sqlalchemy.orm import Session
from app.database import SessionLocal
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import os, json
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)

def extract_interaction_data(text: str) -> dict:
    prompt = f"""Extract interaction details from this text and return ONLY a JSON object with these keys:
    hcp_name, interaction_type, topics_discussed, outcomes, sentiment, follow_up_actions
    
    Text: {text}
    
    Return only valid JSON, nothing else."""
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except:
        return {
            "hcp_name": "Unknown",
            "interaction_type": "Meeting",
            "topics_discussed": text,
            "outcomes": "",
            "sentiment": "Neutral",
            "follow_up_actions": ""
        }

def log_interaction(data: dict) -> dict:
    db = SessionLocal()
    try:
        from sqlalchemy import text
        
        hcp_name = data.get("hcp_name", "Unknown")
        hcp_result = db.execute(
            text("SELECT id FROM hcps WHERE name = :name"),
            {"name": hcp_name}
        ).fetchone()
        
        if not hcp_result:
            db.execute(
                text("INSERT INTO hcps (name) VALUES (:name)"),
                {"name": hcp_name}
            )
            db.commit()
            hcp_result = db.execute(
                text("SELECT id FROM hcps WHERE name = :name"),
                {"name": hcp_name}
            ).fetchone()
        
        hcp_id = hcp_result[0]
        
        db.execute(text("""
            INSERT INTO interactions 
            (hcp_id, interaction_type, date, time, topics_discussed, outcomes, follow_up_actions, sentiment, ai_summary)
            VALUES (:hcp_id, :interaction_type, CURDATE(), CURTIME(), :topics, :outcomes, :followup, :sentiment, :summary)
        """), {
            "hcp_id": hcp_id,
            "interaction_type": data.get("interaction_type", "Meeting"),
            "topics": data.get("topics_discussed", ""),
            "outcomes": data.get("outcomes", ""),
            "followup": data.get("follow_up_actions", ""),
            "sentiment": data.get("sentiment", "Neutral"),
            "summary": data.get("ai_summary", "")
        })
        db.commit()
        
        return {"success": True, "message": f"Interaction with {hcp_name} logged successfully!"}
    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}
    finally:
        db.close()