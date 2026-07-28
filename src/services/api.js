import axios from 'axios';

// Clean the URL before sending it to FastAPI
const cleanUrl = (inputUrl) => {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  
  // Strip trailing :1 or invalid ports at the end of the string
  url = url.replace(/:\d+$/, ''); 

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
};

const BACKEND_URL = 'https://safelink-ai-d5f8.onrender.com';

const postScan = (sanitizedUrl, timeout) =>
  axios.post(
    `${BACKEND_URL}/api/scan`,
    { url: sanitizedUrl },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout
    }
  );

// Inside your scan handle function:
export const scanURL = async (userInput) => {
  const sanitizedUrl = cleanUrl(userInput);

  try {
    // First attempt: assume the backend is warm.
    const response = await postScan(sanitizedUrl, 15000);
    return response.data;
  } catch (err) {
    // If the first attempt timed out or failed to connect, the Render free-tier
    // instance was likely asleep and is now waking up. Retry once with a much
    // longer timeout instead of surfacing a hard failure immediately.
    const isTimeoutOrNetworkError =
      err.code === 'ECONNABORTED' || !err.response;

    if (!isTimeoutOrNetworkError) {
      throw err;
    }

    const response = await postScan(sanitizedUrl, 45000);
    return response.data;
  }
};