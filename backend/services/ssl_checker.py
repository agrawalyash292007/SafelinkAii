import socket
import ssl

from datetime import datetime
from urllib.parse import urlparse


def _hostname(value: str):
    parsed = urlparse(value if "://" in value else f"//{value}")
    return parsed.hostname


def check_ssl(url: str):

    try:

        hostname = _hostname(url)
        if not hostname:
            raise ValueError("Invalid hostname")

        context = ssl.create_default_context()

        with socket.create_connection(
            (hostname, 443),
            timeout=5
        ) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=hostname
            ) as secure_sock:

                cert = secure_sock.getpeercert()

                expiry = datetime.strptime(
                    cert["notAfter"],
                    "%b %d %H:%M:%S %Y %Z"
                )

                issuer = dict(x[0] for x in cert["issuer"])

                subject = dict(x[0] for x in cert["subject"])

                cipher = secure_sock.cipher()

                return {

                    "valid": True,

                    "issuer":
                        issuer.get(
                            "organizationName",
                            "Unknown"
                        ),

                    "issued_to":
                        subject.get(
                            "commonName",
                            hostname
                        ),

                    "expires":
                        expiry.strftime("%Y-%m-%d"),

                    "days_remaining":
                        (expiry - datetime.utcnow()).days,

                    "protocol":
                        secure_sock.version(),

                    "cipher":
                        cipher[0] if cipher else None
                }

    except Exception as e:

        return {

            "valid": False,

            "issuer": None,

            "issued_to": None,

            "expires": None,

            "days_remaining": None,

            "protocol": None,

            "cipher": None,

            "error": str(e)
        }
