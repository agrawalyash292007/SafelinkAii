from urllib.parse import urlparse

def normalize_and_validate_url(raw_url: str) -> dict:
    if not raw_url or not raw_url.strip():
        raise ValueError("URL cannot be empty")
    
    cleaned_url = raw_url.strip()
    
    # Prepend scheme if user enters a bare domain like google.com
    if not cleaned_url.startswith(("http://", "https://")):
        cleaned_url = f"https://{cleaned_url}"
        
    parsed = urlparse(cleaned_url)
    
    if not parsed.netloc:
        raise ValueError("Invalid domain or URL structure")
        
    return {
        "normalized_url": cleaned_url,
        "hostname": parsed.netloc.split(":")[0],  # Strip port if present
        "scheme": parsed.scheme
    }