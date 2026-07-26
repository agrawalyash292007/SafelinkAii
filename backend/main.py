from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import scan

app = FastAPI(
    title="SafeLink AI API",
    description="Backend threat intelligence and domain analysis engine",
    version="1.0.0"
)

# 1. ALLOWED ORIGINS (Explicit list without wildcard "*")
origins = [
    "https://safe-link-ai-igpo.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# 2. CORS MIDDLEWARE
# Supports explicit origins + dynamic Vercel preview URLs via regex
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Matches any Vercel deployment preview
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 3. GLOBAL EXCEPTION HANDLER
# Dynamically reflects the incoming origin so 500 errors never trigger CORS blocks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    client_origin = request.headers.get("origin")
    
    # Check if origin is allowed
    allowed_origin = "https://safe-link-ai-igpo.vercel.app"
    if client_origin and (client_origin in origins or ".vercel.app" in client_origin or "localhost" in client_origin):
        allowed_origin = client_origin

    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "details": str(exc)
        },
        headers={
            "Access-Control-Allow-Origin": allowed_origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        }
    )

# 4. INCLUDE ROUTERS
app.include_router(scan.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "SafeLink AI Backend Running"}