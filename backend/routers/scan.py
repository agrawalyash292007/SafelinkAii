import asyncio
from urllib.parse import urlparse
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["scan"])

def extract_domain(raw_url: str) -> str:
    """Safely extracts the hostname/domain from a raw URL input."""
    if not raw_url.startswith(("http://", "https://")):
        raw_url = f"http://{raw_url}"
    
    parsed = urlparse(raw_url)
    # hostname strips ports and user info automatically
    return parsed.hostname or raw_url.split("/")[0].split(":")[0]

@router.post("/scan")
async def scan_url(payload: dict):
    raw_url = payload.get("url", "")
    if not raw_url:
        return {"status": "error", "message": "URL parameter missing"}

    clean_host = extract_domain(raw_url)

    # Safe execution wrappers with honest fallback states
    async def safe_ssl():
        try:
            from services.ssl_checker import check_ssl
            return await check_ssl(clean_host)
        except Exception as e:
            return {"valid": False, "error": f"SSL check failed: {str(e)}"}

    async def safe_whois():
        try:
            from services.whois_checker import check_whois
            return await check_whois(clean_host)
        except Exception as e:
            return {"registrar": "Unknown", "age_days": None, "error": f"WHOIS check failed: {str(e)}"}

    # Run tasks concurrently
    ssl_data, whois_data = await asyncio.gather(
        safe_ssl(), 
        safe_whois(), 
        return_exceptions=True
    )

    # Handle unexpected task exceptions outside the wrappers
    ssl_res = ssl_data if not isinstance(ssl_data, Exception) else {"valid": False, "error": str(ssl_data)}
    whois_res = whois_data if not isinstance(whois_data, Exception) else {"registrar": "Unknown", "error": str(whois_data)}

    # Adjust risk score dynamically based on valid results
    ssl_ok = ssl_res.get("valid", False)
    
    return {
        "status": "success",
        "domain": clean_host,
        "ssl": ssl_res,
        "whois": whois_res,
        "risk_score": 15 if ssl_ok else 85,
        "verdict": "SAFE" if ssl_ok else "SUSPICIOUS"
    }
