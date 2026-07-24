import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("VT_API_KEY")


def check_virustotal(url: str):

    if not API_KEY:
        return {
            "available": False,
            "error": "VirusTotal API key not found"
        }

    try:
        response = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers={
                "x-apikey": API_KEY
            },
            data={
                "url": url
            },
            timeout=20
        )

        if response.status_code != 200:
            return {
                "available": False,
                "error": response.text
            }

        analysis_id = response.json()["data"]["id"]

        report = requests.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers={
                "x-apikey": API_KEY
            },
            timeout=20
        )

        if report.status_code != 200:
            return {
                "available": False,
                "error": report.text
            }

        stats = report.json()["data"]["attributes"]["stats"]

        return {
            "available": True,
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
            "timeout": stats.get("timeout", 0)
        }

    except Exception as e:
        return {
            "available": False,
            "error": str(e)
        }