from app.database import SessionLocal
from sqlalchemy import text

def edit_interaction(interaction_id: int, updated_data: dict) -> dict:
    db = SessionLocal()
    try:
        existing = db.execute(
            text("SELECT id FROM interactions WHERE id = :id"),
            {"id": interaction_id}
        ).fetchone()

        if not existing:
            return {"success": False, "message": f"Interaction {interaction_id} not found"}

        fields = []
        params = {"id": interaction_id}

        if updated_data.get("interaction_type"):
            fields.append("interaction_type = :interaction_type")
            params["interaction_type"] = updated_data["interaction_type"]

        if updated_data.get("topics_discussed"):
            fields.append("topics_discussed = :topics_discussed")
            params["topics_discussed"] = updated_data["topics_discussed"]

        if updated_data.get("outcomes"):
            fields.append("outcomes = :outcomes")
            params["outcomes"] = updated_data["outcomes"]

        if updated_data.get("follow_up_actions"):
            fields.append("follow_up_actions = :follow_up_actions")
            params["follow_up_actions"] = updated_data["follow_up_actions"]

        if updated_data.get("sentiment"):
            fields.append("sentiment = :sentiment")
            params["sentiment"] = updated_data["sentiment"]

        if not fields:
            return {"success": False, "message": "No fields to update"}

        query = f"UPDATE interactions SET {', '.join(fields)} WHERE id = :id"
        db.execute(text(query), params)
        db.commit()

        return {"success": True, "message": f"Interaction {interaction_id} updated successfully!"}
    except Exception as e:
        db.rollback()
        return {"success": False, "message": str(e)}
    finally:
        db.close()