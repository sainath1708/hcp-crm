from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import interaction
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HCP CRM API",
    description="AI-First CRM for Healthcare Professionals",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3100",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interaction.router, prefix="/api/v1", tags=["interactions"])


@app.get("/")
def root():
    return {"message": "HCP CRM API is running"}
