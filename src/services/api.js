import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safelink-ai-backend.onrender.com';

/**
 * Normalizes input URLs to ensure valid protocol structure
 */
export const normalizeUrl = (input) => {
  if (!input) return '';
  let trimmed = input.trim().toLowerCase();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.href;
  } catch {
    return trimmed;
  }
};

export const scanURL = async (rawUrl) => {
  const cleanUrl = normalizeUrl(rawUrl);

  const response = await axios.post(
    `${API_BASE_URL}/api/scan`,
    { url: cleanUrl },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    }
  );

  return response.data;
};