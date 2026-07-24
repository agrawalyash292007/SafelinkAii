def calculate_risk(
    ssl_info,
    whois_info,
    dns_info,
    http_info,
    virustotal_info,
    urlscan_info,
):

    score = 0
    reasons = []

    # ---------- SSL ----------
    if not ssl_info.get("valid", False):
        score += 25
        reasons.append("Invalid SSL certificate")

    # ---------- WHOIS ----------
    age = whois_info.get("domain_age_days", 0)

    if age < 30:
        score += 25
        reasons.append("Domain registered less than 30 days ago")

    elif age < 180:
        score += 15
        reasons.append("Recently registered domain")

    # ---------- VirusTotal ----------
    malicious = virustotal_info.get("malicious", 0)
    suspicious = virustotal_info.get("suspicious", 0)

    if malicious > 0:
        score += 35
        reasons.append(
            f"{malicious} VirusTotal engine(s) flagged this website as malicious"
        )

    if suspicious > 0:
        score += 15
        reasons.append(
            f"{suspicious} VirusTotal engine(s) marked this website as suspicious"
        )

    # ---------- URLScan ----------
    if urlscan_info.get("available"):

        verdict = urlscan_info.get("overall_verdict", {})

        if verdict.get("malicious"):
            score += 30
            reasons.append("URLScan detected malicious behaviour")

        elif verdict.get("score", 0) > 50:
            score += 15
            reasons.append("URLScan reputation score is elevated")

    # ---------- Redirects ----------
    redirects = http_info.get("redirect_count", 0)

    if redirects > 5:
        score += 10
        reasons.append("Website redirects multiple times")

    # ---------- HTTP Status ----------
    if http_info.get("status_code") in [403, 404, 500]:
        score += 5
        reasons.append("Unexpected HTTP response")

    # ---------- Security Headers ----------
    headers = [
        "strict_transport_security",
        "content_security_policy",
        "x_frame_options",
        "x_content_type_options",
    ]

    missing = sum(1 for h in headers if not http_info.get(h))

    if missing == 4:
        score += 5
        reasons.append("All important HTTP security headers are missing")

    elif missing == 3:
        score += 2
        reasons.append("Several HTTP security headers are missing")

    score = min(score, 100)

    if score <= 20:
        level = "Low"
        color = "green"

    elif score <= 50:
        level = "Medium"
        color = "yellow"

    elif score <= 80:
        level = "High"
        color = "orange"

    else:
        level = "Critical"
        color = "red"

    if not reasons:
        reasons.append("No significant security risks detected")

    return {
        "score": score,
        "level": level,
        "color": color,
        "reasons": reasons
    }