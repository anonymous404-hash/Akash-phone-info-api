// api/index.js
// Unlimited Proxy API for Zephrex Digital

const KEY_STORE = {
  "AKASH_PAID3MONTH": {
    name: "Premium Unlimited Key",
    expiry_date: "2026-12-31", // Expiry badha di hai
    status: "Active (Unlimited)"
  }
};

const EXTERNAL_API = {
  baseUrl: "https://www.zephrexdigital.site/api",
  key: "ZEPH-7M7CD"
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Use GET method' });

  const { key, type, term } = req.query;

  if (!key || !type || !term) {
    return res.status(400).json({ success: false, error: 'Missing parameters (key, type, or term)' });
  }

  const keyData = KEY_STORE[key];
  if (!keyData) {
    return res.status(403).json({ success: false, error: 'Invalid API key' });
  }

  // Expiry Check (Sirf date check hogi, limit nahi)
  const today = new Date();
  const expiry = new Date(keyData.expiry_date);
  if (today > expiry) {
    return res.status(403).json({ success: false, error: 'Key Expired' });
  }

  try {
    const externalUrl = `${EXTERNAL_API.baseUrl}?key=${EXTERNAL_API.key}&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`;
    const response = await fetch(externalUrl);
    const data = await response.json();

    // Response with your bot branding
    return res.json({
      ...data,
      key_details: {
        status: "Unlimited Access",
        expiry: keyData.expiry_date,
        info: "No daily limit applied"
      },
      api_developer: "@Akash_Exploits_bot",
      owner: "https://t.me/Akash_Exploits_bot",
      powered_by: "TITAN V6 HYPERION SYSTEM"
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: 'External API Error' });
  }
};
