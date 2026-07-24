const BASE_URL = "https://safelink-ai-d5f8.onrender.com";

export async function scanURL(url) {
  const response = await fetch(`${BASE_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.detail || "Failed to scan URL");
  }

  return json.data;
}