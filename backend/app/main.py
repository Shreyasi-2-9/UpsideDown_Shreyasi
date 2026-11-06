from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine, Base
from app.models import *  # Import all models so metadata knows them

# Import routers
from app.routers import (
    auth,
    services,
    technicians,
    bookings,
    negotiations,
    escrow,
    chat,
    tracking,
    evidence,
    group_bookings,
    reviews,
    notifications,
    sos,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="FastAPI Civic Backend for HomeCare 360: Fair Civic Negotiation, Escrow Protection, and Verified Technicians.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 Router Registration
api_v1_prefix = settings.API_V1_STR

app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(services.router, prefix=api_v1_prefix)
app.include_router(technicians.router, prefix=api_v1_prefix)
app.include_router(bookings.router, prefix=api_v1_prefix)
app.include_router(negotiations.router, prefix=api_v1_prefix)
app.include_router(escrow.router, prefix=api_v1_prefix)
app.include_router(chat.router, prefix=api_v1_prefix)
app.include_router(tracking.router, prefix=api_v1_prefix)
app.include_router(evidence.router, prefix=api_v1_prefix)
app.include_router(group_bookings.router, prefix=api_v1_prefix)
app.include_router(reviews.router, prefix=api_v1_prefix)
app.include_router(notifications.router, prefix=api_v1_prefix)
app.include_router(sos.router, prefix=api_v1_prefix)
app.include_router(admin.router, prefix=api_v1_prefix)

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "HomeCare 360 Civic Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }
