from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from typing import TypedDict, List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)

class AgentState(TypedDict):
    messages: List
    current_tool: Optional[str]
    interaction_data: Optional[dict]
    response: Optional[str]

def agent_node(state: AgentState):
    messages = state["messages"]
    system = SystemMessage(content="""You are an AI assistant for a Healthcare Professional CRM system.
    You help field representatives log and manage their interactions with doctors and HCPs.
    When a user describes an interaction, extract:
    - HCP name
    - Interaction type (Meeting, Call, Email, etc.)
    - Topics discussed
    - Outcomes
    - Sentiment (Positive, Neutral, Negative)
    - Follow up actions
    Always be helpful and professional.""")
    
    response = llm.invoke([system] + messages)
    return {"messages": messages + [response], "response": response.content}

def should_continue(state: AgentState):
    return END

def create_agent():
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges("agent", should_continue)
    return workflow.compile()

agent = create_agent()

def run_agent(message: str, history: List = []):
    messages = history + [HumanMessage(content=message)]
    result = agent.invoke({
        "messages": messages,
        "current_tool": None,
        "interaction_data": None,
        "response": None
    })
    return result["response"]