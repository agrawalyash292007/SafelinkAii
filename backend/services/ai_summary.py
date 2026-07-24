def generate_ai_summary(
    ssl_info,
    whois_info,
    http_info,
    virustotal_info,
    urlscan_info,
    risk_info
):

    paragraphs = []

    if risk_info["level"] == "Low":
        opening = "This website appears to be legitimate based on the collected security signals."

    elif risk_info["level"] == "Medium":
        opening = "This website shows a few warning signs. Exercise caution before interacting with it."

    elif risk_info["level"] == "High":
        opening = "This website presents multiple security concerns and should be approached carefully."

    else:
        opening = "This website appears highly suspicious and should be avoided."

    paragraphs.append(opening)

    if ssl_info.get("valid"):
        paragraphs.append(
            f"It uses a valid SSL certificate issued by {ssl_info.get('issuer')}."
        )
    else:
        paragraphs.append(
            "The SSL certificate could not be verified."
        )

    years = whois_info.get("domain_age_years", 0)

    if years >= 5:
        paragraphs.append(
            f"The domain has existed for approximately {years} years, which generally indicates stability."
        )

    elif years > 0:
        paragraphs.append(
            f"The domain is only {years} year(s) old."
        )

    if virustotal_info.get("malicious", 0) == 0:
        paragraphs.append(
            "VirusTotal reported no malicious detections."
        )
    else:
        paragraphs.append(
            f"VirusTotal detected {virustotal_info.get('malicious')} malicious engines."
        )

    if urlscan_info.get("available"):

        verdict = urlscan_info.get("overall_verdict", {})

        if verdict.get("malicious"):
            paragraphs.append(
                "URLScan also classified this website as malicious."
            )
        else:
            paragraphs.append(
                "URLScan did not detect malicious behaviour."
            )

    missing = 0

    for h in [
        "strict_transport_security",
        "content_security_policy",
        "x_frame_options",
        "x_content_type_options"
    ]:
        if not http_info.get(h):
            missing += 1

    if missing >= 3:
        paragraphs.append(
            "Some recommended HTTP security headers are missing."
        )

    if risk_info["level"] == "Low":
        recommendation = "Safe to visit."

    elif risk_info["level"] == "Medium":
        recommendation = "Proceed carefully and avoid sharing sensitive information."

    elif risk_info["level"] == "High":
        recommendation = "Avoid entering passwords or financial information."

    else:
        recommendation = "Do not visit this website."

    return {
        "summary": " ".join(paragraphs),
        "recommendation": recommendation
    }