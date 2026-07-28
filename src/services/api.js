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

const riskFromLegacyFields = (payload) => {
  if (payload.risk) return payload.risk;

  const score = payload.risk_score ?? 0;
  const verdict = String(payload.verdict || '').toLowerCase();
  const level =
    verdict === 'safe'
      ? 'Low'
      : verdict === 'suspicious'
      ? 'High'
      : payload.verdict || 'Unknown';

  const color =
    score <= 20
      ? 'green'
      : score <= 50
      ? 'yellow'
      : score <= 80
      ? 'orange'
      : 'red';

  return {
    score,
    level,
    color,
    reasons: payload.ssl?.valid === false
      ? ['SSL certificate could not be verified']
      : ['No significant security risks detected']
  };
};

const normalizeScanResponse = (response) => {
  const payload = response.data || {};
  const report = payload.data && typeof payload.data === 'object'
    ? { ...payload.data }
    : { ...payload };

  const status = payload.status || report.status || (payload.success === false ? 'error' : 'success');
  const risk = riskFromLegacyFields(report);
  const whois = report.whois || {};

  return {
    ...report,
    status,
    success: payload.success ?? status === 'success',
    message: payload.message || report.message || '',
    http_status: response.status,
    risk,
    ai: report.ai || {
      summary: risk.reasons.join('. '),
      recommendation: risk.level === 'Low'
        ? 'Safe to visit.'
        : 'Proceed carefully and avoid sharing sensitive information.'
    },
    whois: {
      ...whois,
      available: whois.available ?? whois.status === 'success',
      domain_age_years:
        whois.domain_age_years ??
        (whois.age_days != null ? Math.round((whois.age_days / 365) * 10) / 10 : undefined)
    }
  };
};

// Inside your scan handle function:
export const scanURL = async (userInput) => {
  const sanitizedUrl = cleanUrl(userInput);

  try {
    // First attempt: assume the backend is warm.
    const response = await postScan(sanitizedUrl, 15000);
    return normalizeScanResponse(response);
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
    return normalizeScanResponse(response);
  }
};
