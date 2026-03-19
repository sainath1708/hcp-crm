from app.database import SessionLocal
from sqlalchemy import text

def get_hcp_history(hcp_name: str) -> dict:
    db = SessionLocal()
    try:
        hcp = db.execute(
            text("SELECT id, name, specialty, location, email, phone FROM hcps WHERE name LIKE :name"),
            {"name": f"%{hcp_name}%"}
        ).fetchone()

        if not hcp:
            return {"success": False, "message": f"No HCP found with name {hcp_name}"}

        hcp_id = hcp[0]

        interactions = db.execute(
            text("""
                SELECT id, interaction_type, date, time, topics_discussed, 
                       outcomes, follow_up_actions, sentiment, ai_summary
                FROM interactions 
                WHERE hcp_id = :hcp_id 
                ORDER BY date DESC, time DESC
            """),
            {"hcp_id": hcp_id}
        ).fetchall()

        history = []
        for i in interactions:
            history.append({
                "id": i[0],
                "interaction_type": i[1],
                "date": str(i[2]),
                "time": str(i[3]),
                "topics_discussed": i[4],
                "outcomes": i[5],
                "follow_up_actions": i[6],
                "sentiment": i[7],
                "ai_summary": i[8]
            })

        return {
            "success": True,
            "hcp": {
                "id": hcp[0],
                "name": hcp[1],
                "specialty": hcp[2],
                "location": hcp[3],
                "email": hcp[4],
                "phone": hcp[5]
            },
            "total_interactions": len(history),
            "interactions": history
        }
    except Exception as e:
        return {"success": False, "message": str(e)}
    finally:
        db.close()