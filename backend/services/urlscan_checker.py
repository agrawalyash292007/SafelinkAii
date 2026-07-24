import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("URLSCAN_API_KEY")


def check_urlscan(url: str):

    if not API_KEY:
        return {
            "available": False,
            "error": "URLSCAN_API_KEY not found"
        }

    headers = {
        "API-Key": API_KEY,
        "Content-Type": "application/json"
    }

    try:
        # Submit URL for scanning
        submit = requests.post(
            "https://urlscan.io/api/v1/scan/",
            headers=headers,
            json={
                "url": url,
                "visibility": "public"
            },
            timeout=30
        )

        print("Submit Status:", submit.status_code)
        print("Submit Response:", submit.text)

        if submit.status_code not in [200, 201]:
            return {
                "available": False,
                "error": submit.text
            }

        submit_json = submit.json()

        result_api = submit_json.get("api")

        if not result_api:
            return {
                "available": False,
                "error": "Result API URL not returned by URLScan."
            }

        # Wait for analysis to complete
        for attempt in range(15):

            print(f"Polling attempt {attempt + 1}")

            result = requests.get(
                result_api,
                headers=headers,
                timeout=30
            )

            print("Result Status:", result.status_code)

            if result.status_code == 200:

                data = result.json()

                page = data.get("page", {})
                task = data.get("task", {})
                verdicts = data.get("verdicts", {})

                return {
                    "available": True,
                    "page_title": page.get("title"),
                    "final_url": page.get("url"),
                    "server": page.get("server"),
                    "ip": page.get("ip"),
                    "country": page.get("country"),
                    "asn": page.get("asn"),
                    "screenshot": task.get("screenshotURL"),
                    "overall_verdict": verdicts.get("overall", {})
                }

            elif result.status_code == 404:
                # Still processing
                time.sleep(3)
                continue

            else:
                return {
                    "available": False,
                    "error": result.text
                }

        return {
            "available": False,
            "error": "Analysis timeout (45 seconds)"
        }

    except Exception as e:
        return {
            "available": False,
            "error": str(e)
        }