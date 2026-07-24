from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SafeLink AI API",
    version="1.0.0",
    description="Backend API for SafeLink AI"
)

# Allow React frontend to access the API
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        # Your deployed frontend
        "https://safe-link-ai-igpo.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "SafeLink AI Backend Running 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
from routers.scan import router as scan_router

app.include_router(scan_router)