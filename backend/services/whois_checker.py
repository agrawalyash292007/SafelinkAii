import whois
from urllib.parse import urlparse
from datetime import datetime, timezone


def format_date(date):
    if isinstance(date, list):
        date = date[0]

    if isinstance(date, datetime):
        return date.strftime("%Y-%m-%d")

    return None


def calculate_age(created):

    if isinstance(created, list):
        created = created[0]

    if isinstance(created, datetime):

        # Convert both to UTC-aware datetimes
        now = datetime.now(timezone.utc)

        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)

        days = (now - created).days

        years = days // 365

        return {
            "days": days,
            "years": years
        }

    return {
        "days": None,
        "years": None
    }


def check_whois(url: str):

    try:

        domain = urlparse(url).hostname

        info = whois.whois(domain)

        age = calculate_age(info.creation_date)

        return {

            "available": True,

            "registrar": info.registrar,

            "creation_date": format_date(info.creation_date),

            "expiration_date": format_date(info.expiration_date),

            "updated_date": format_date(info.updated_date),

            "name_servers": info.name_servers,

            "country": info.country,

            "organization": info.org,

            "emails": info.emails,

            "domain_age_days": age["days"],

            "domain_age_years": age["years"]

        }

    except Exception as e:

        return {

            "available": False,

            "error": str(e)

        }