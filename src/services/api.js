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

// Inside your scan handle function:
export const scanURL = async (userInput) => {
  const sanitizedUrl = cleanUrl(userInput);

  const response = await axios.post(
    'https://safelink-ai-backend.onrender.com/api/scan',
    { url: sanitizedUrl },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000 // Give Render enough time to respond
    }
  );

  return response.data;
};