import asyncio
from fastapi import APIRouter, HTTPException
from models.scan_models import ScanRequest
from services.url_validator import normalize_and_validate_url
from services.whois_checker import check_whois
from services.ssl_checker import check_ssl
from services.virustotal_checker import check_virustotal
from services.dns_checker import check_dns
from services.ai_summary import generate_ai_summary
from services.risk_engine import calculate_risk

router = APIRouter(prefix="/api", tags=["scan"])

@router.post("/scan")
async def perform_scan(request: ScanRequest):
    try:
        # 1. Normalize input (Handles bare domains like google.com)
        url_info = normalize_and_validate_url(request.url)
        hostname = url_info["hostname"]
        full_url = url_info["normalized_url"]
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))

    # 2. Execute service checks concurrently without crashing on single failures
    results = await asyncio.gather(
        check_ssl(hostname),
        check_whois(hostname),
        check_virustotal(hostname),
        check_dns(hostname),
        return_exceptions=True
    )

    ssl_data = results[0] if not isinstance(results[0], Exception) else {"valid": False}
    whois_data = results[1] if not isinstance(results[1], Exception) else {"registrar": "Unknown"}
    vt_data = results[2] if not isinstance(results[2], Exception) else {"malicious": 0, "suspicious": 0}
    dns_data = results[3] if not isinstance(results[3], Exception) else {}

    # 3. Calculate Risk & AI Metrics
    risk = calculate_risk(ssl_data, whois_data, vt_data)
    ai_analysis = await generate_ai_summary(hostname, risk, ssl_data, vt_data)

    return {
        "normalized_url": full_url,
        "hostname": hostname,
        "scanned_at": datetime.utcnow().isoformat(),
        "risk": risk,
        "ssl": ssl_data,
        "whois": whois_data,
        "dns": dns_data,
        "virustotal": vt_data,
        "ai": ai_analysis
    }