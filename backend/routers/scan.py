import asyncio
from fastapi import APIRouter

from services.ai_summary import generate_ai_summary
from services.dns_checker import check_dns
from services.http_checker import check_http
from services.risk_engine import calculate_risk
from services.ssl_checker import check_ssl
from services.url_validator import normalize_and_validate_url
from services.urlscan_checker import check_urlscan
from services.virustotal_checker import check_virustotal
from services.whois_checker import check_whois

router = APIRouter(prefix="/api", tags=["scan"])

def extract_domain(raw_url: str) -> str:
    """Safely extracts the hostname/domain from a raw URL input."""
    return normalize_and_validate_url(raw_url)["hostname"]

@router.post("/scan")
async def scan_url(payload: dict):
    raw_url = payload.get("url", "")
    if not raw_url:
        return {"status": "error", "success": False, "message": "URL parameter missing", "data": None}

    try:
        url_info = normalize_and_validate_url(raw_url)
    except ValueError as e:
        return {"status": "error", "success": False, "message": str(e), "data": None}

    normalized_url = url_info["normalized_url"]
    clean_host = url_info["hostname"]

    # Safe execution wrappers with honest fallback states
    async def safe_ssl():
        try:
            return await asyncio.to_thread(check_ssl, clean_host)
        except Exception as e:
            return {"valid": False, "error": f"SSL check failed: {str(e)}"}

    async def safe_whois():
        try:
            return await check_whois(clean_host)
        except Exception as e:
            return {"registrar": "Unknown", "age_days": None, "error": f"WHOIS check failed: {str(e)}"}

    async def safe_dns():
        try:
            return await asyncio.to_thread(check_dns, clean_host)
        except Exception as e:
            return {"available": False, "error": f"DNS check failed: {str(e)}"}

    async def safe_http():
        try:
            return await asyncio.to_thread(check_http, normalized_url)
        except Exception as e:
            return {"available": False, "error": f"HTTP check failed: {str(e)}"}

    async def safe_virustotal():
        try:
            return await asyncio.to_thread(check_virustotal, normalized_url)
        except Exception as e:
            return {"available": False, "error": f"VirusTotal check failed: {str(e)}"}

    async def safe_urlscan():
        try:
            return await asyncio.to_thread(check_urlscan, normalized_url)
        except Exception as e:
            return {"available": False, "error": f"URLScan check failed: {str(e)}"}

    # Run tasks concurrently
    ssl_data, whois_data, dns_data, http_data, virustotal_data, urlscan_data = await asyncio.gather(
        safe_ssl(), 
        safe_whois(), 
        safe_dns(),
        safe_http(),
        safe_virustotal(),
        safe_urlscan(),
        return_exceptions=True
    )

    # Handle unexpected task exceptions outside the wrappers
    ssl_res = ssl_data if not isinstance(ssl_data, Exception) else {"valid": False, "error": str(ssl_data)}
    whois_res = whois_data if not isinstance(whois_data, Exception) else {"registrar": "Unknown", "error": str(whois_data)}
    dns_res = dns_data if not isinstance(dns_data, Exception) else {"available": False, "error": str(dns_data)}
    http_res = http_data if not isinstance(http_data, Exception) else {"available": False, "error": str(http_data)}
    virustotal_res = virustotal_data if not isinstance(virustotal_data, Exception) else {"available": False, "error": str(virustotal_data)}
    urlscan_res = urlscan_data if not isinstance(urlscan_data, Exception) else {"available": False, "error": str(urlscan_data)}

    risk_res = calculate_risk(
        ssl_res,
        whois_res,
        dns_res,
        http_res,
        virustotal_res,
        urlscan_res,
    )
    ai_res = generate_ai_summary(
        ssl_res,
        whois_res,
        http_res,
        virustotal_res,
        urlscan_res,
        risk_res,
    )
    
    report = {
        "status": "success",
        "success": True,
        "message": "Scan completed successfully",
        "url": raw_url,
        "normalized_url": normalized_url,
        "domain": clean_host,
        "ssl": ssl_res,
        "whois": whois_res,
        "dns": dns_res,
        "http": http_res,
        "virustotal": virustotal_res,
        "urlscan": urlscan_res,
        "risk": risk_res,
        "ai": ai_res,
        "risk_score": risk_res["score"],
        "verdict": risk_res["level"].upper()
    }

    return {
        **report,
        "data": report
    }
