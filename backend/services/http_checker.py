import requests


def check_http(url: str):
    try:
        response = requests.get(
            url,
            timeout=10,
            allow_redirects=True,
            headers={
                "User-Agent": "SafeLinkAI/1.0"
            }
        )

        headers = response.headers

        return {
            "available": True,

            "status_code": response.status_code,
            "reason": response.reason,

            "final_url": response.url,
            "redirect_count": len(response.history),

            "server": headers.get("Server"),

            "strict_transport_security": headers.get(
                "Strict-Transport-Security"
            ),

            "content_security_policy": headers.get(
                "Content-Security-Policy"
            ),

            "x_frame_options": headers.get(
                "X-Frame-Options"
            ),

            "x_content_type_options": headers.get(
                "X-Content-Type-Options"
            ),

            "referrer_policy": headers.get(
                "Referrer-Policy"
            ),

            "permissions_policy": headers.get(
                "Permissions-Policy"
            ),

            "content_type": headers.get(
                "Content-Type"
            ),

            "content_length": headers.get(
                "Content-Length"
            )
        }

    except Exception as e:
        return {
            "available": False,
            "error": str(e)
        }