import dns.resolver
import socket
from urllib.parse import urlparse


def resolve_record(domain, record_type):
    try:
        answers = dns.resolver.resolve(domain, record_type)
        return [str(r) for r in answers]
    except Exception:
        return []


def check_dns(url: str):

    try:

        hostname = urlparse(url).hostname

        ipv4 = socket.gethostbyname(hostname)

        try:
            ipv6 = socket.getaddrinfo(
                hostname,
                None,
                socket.AF_INET6
            )[0][4][0]
        except Exception:
            ipv6 = None

        return {

            "available": True,

            "hostname": hostname,

            "ipv4": ipv4,

            "ipv6": ipv6,

            "mx_records": resolve_record(
                hostname,
                "MX"
            ),

            "name_servers": resolve_record(
                hostname,
                "NS"
            ),

            "txt_records": resolve_record(
                hostname,
                "TXT"
            ),

            "cname": resolve_record(
                hostname,
                "CNAME"
            ),

            "aaaa": resolve_record(
                hostname,
                "AAAA"
            )

        }

    except Exception as e:

        return {

            "available": False,

            "error": str(e)

        }