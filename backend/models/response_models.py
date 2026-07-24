from pydantic import BaseModel
from typing import Optional


class SSLInfo(BaseModel):
    valid: bool
    issuer: Optional[str] = None
    issued_to: Optional[str] = None
    expires: Optional[str] = None
    days_remaining: Optional[int] = None
    protocol: Optional[str] = None
    cipher: Optional[str] = None
    error: Optional[str] = None


class ScanData(BaseModel):
    url: str
    normalized_url: str
    ssl: SSLInfo
    whois: dict = {}
    dns: dict = {}
    http: dict = {}
    virustotal: dict = {}
    safe_browsing: dict = {}
    phishtank: dict = {}
    risk: dict = {}
    ai: dict = {}


class ScanResponse(BaseModel):
    success: bool
    message: str
    data: ScanData