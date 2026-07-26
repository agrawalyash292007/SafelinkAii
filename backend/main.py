from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import scan

app = FastAPI(
    title="SafeLink AI API",
    description="Backend threat intelligence and domain analysis engine",
    version="1.0.0"
)

# 1. ALLOWED ORIGINS CONFIGURATION
origins = [
    "https://safe-link-ai-igpo.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "*"  # Allows all origins
]

# 2. ADD CORS MIDDLEWARE (Must be placed before router inclusion)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],        # Handles OPTIONS, POST, GET, etc.
    allow_headers=["*"],        # Handles Content-Type, Authorization, etc.
)

# 3. GLOBAL EXCEPTION HANDLER
# Ensures 500 errors still return valid CORS headers so the browser doesn't obscure the real message
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"}
    )

# 4. INCLUDE ROUTERS
app.include_router(scan.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "SafeLink AI Backend Running"}