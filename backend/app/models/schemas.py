from pydantic import BaseModel
from typing import Optional

class HCPBase(BaseModel):
    name: str
    specialty: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class InteractionCreate(BaseModel):
    hcp_name: str
    interaction_type: str
    date: str
    time: str
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    sentiment: Optional[str] = None

class InteractionUpdate(BaseModel):
    interaction_type: Optional[str] = None
    topics_discussed: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    sentiment: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    interaction_id: Optional[int] = None

class InteractionResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None