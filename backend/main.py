from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import scan

app = FastAPI(
    title="SafeLink AI API",
    description="Backend threat intelligence and domain analysis engine",
    version="1.0.0"
)

# --- CORS CONFIGURATION ---
# Allowed origins: your Vercel domain and local development URLs
origins = [
    "https://safe-link-ai-igpo.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "*"  # Allows all origins for hackathon / production flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],        # Allows GET, POST, OPTIONS, etc.
    allow_headers=["*"],        # Allows Content-Type, Authorization, etc.
)

# Include routers
app.include_router(scan.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "SafeLink AI Backend Running"}