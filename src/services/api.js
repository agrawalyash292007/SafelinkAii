import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safelink-ai-backend.onrender.com';

/**
 * Clean & sanitize URL input
 */
export const sanitizeInputUrl = (input) => {
  if (!input) return '';
  let cleaned = input.trim();

  // Prepend https:// if missing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const urlObj = new URL(cleaned);
    // Remove invalid single-digit ports like :1
    if (urlObj.port && urlObj.port.length < 2) {
      urlObj.port = '';
    }
    return urlObj.href;
  } catch {
    return cleaned;
  }
};

export const scanURL = async (rawUrl) => {
  const targetUrl = sanitizeInputUrl(rawUrl);

  const response = await axios.post(
    `${API_BASE_URL}/api/scan`,
    { url: targetUrl },
    {
      headers: { 
        'Content-Type': 'application/json' 
      },
      timeout: 12000,
    }
  );

  return response.data;
};