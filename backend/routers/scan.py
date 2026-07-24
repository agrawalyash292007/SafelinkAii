from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from models.scan_models import ScanRequest

from services.url_validator import normalize_url
from services.ssl_checker import check_ssl
from services.whois_checker import check_whois
from services.dns_checker import check_dns
from services.http_checker import check_http
from services.virustotal_checker import check_virustotal
from services.urlscan_checker import check_urlscan
from services.risk_engine import calculate_risk
from services.ai_summary import generate_ai_summary

router = APIRouter(
    prefix="/api",
    tags=["Scanner"]
)


@router.post("/scan")
def scan(request: ScanRequest):

    try:
        # Normalize URL
        normalized = normalize_url(request.url)

        # Run all scanners
        ssl_info = check_ssl(normalized)
        whois_info = check_whois(normalized)
        dns_info = check_dns(normalized)
        http_info = check_http(normalized)
        virustotal_info = check_virustotal(normalized)
        urlscan_info = check_urlscan(normalized)

        # Calculate Risk
        risk_info = calculate_risk(
            ssl_info,
            whois_info,
            dns_info,
            http_info,
            virustotal_info,
            urlscan_info
        )

        # Generate AI Summary
        ai_info = generate_ai_summary(
            ssl_info,
            whois_info,
            http_info,
            virustotal_info,
            urlscan_info,
            risk_info
        )

        return {
            "success": True,
            "message": "Scan completed successfully",
            "data": {

                "url": request.url,
                "normalized_url": normalized,
                "scan_time": datetime.now(
                    timezone.utc
                ).isoformat(),

                "ssl": ssl_info,
                "whois": whois_info,
                "dns": dns_info,
                "http": http_info,
                "virustotal": virustotal_info,
                "urlscan": urlscan_info,

                # Reserved for future APIs
                "phishtank": {},

                "risk": risk_info,

                "ai": ai_info
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )