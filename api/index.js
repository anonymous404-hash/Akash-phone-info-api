// api/index.js
// Proxy API for Zephrex Digital with your own key management

// Your own API key store
const KEY_STORE = {
  "AKASH_PAID3MONTH": {
    name: "Premium Key",
    expiry_date: "2026-04-29",
    days_remaining: 70,
    status: "Active",
    daily_limit: 100,
    used_today: 0,
    total_used: 0
  }
};

// External API configuration
const EXTERNAL_API = {
  baseUrl: "https://www.zephrexdigital.site/api",
  key: "ZEPH-7M7CD"
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.' 
    });
  }

  const { key, type, term } = req.query;

  if (!key) return res.status(400).json({ success: false, error: 'Missing API key' });
  if (!type) return res.status(400).json({ success: false, error: 'Missing type parameter' });
  if (!term) return res.status(400).json({ success: false, error: 'Missing term parameter' });

  const keyData = KEY_STORE[key];
  if (!keyData) {
    return res.status(403).json({ success: false, error: 'Invalid API key' });
  }

  const today = new Date();
  const expiry = new Date(keyData.expiry_date);
  if (today > expiry) {
    return res.status(403).json({ 
      success: false, 
      error: 'API key expired',
      key_details: {
        expiry_date: keyData.expiry_date,
        status: 'Expired'
      }
    });
  }

  if (keyData.used_today >= keyData.daily_limit) {
    return res.status(429).json({ 
      success: false, 
      error: 'Daily limit exceeded' 
    });
  }

  keyData.used_today++;
  keyData.total_used++;

  try {
    const externalUrl = `${EXTERNAL_API.baseUrl}?key=${EXTERNAL_API.key}&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`;
    const response = await fetch(externalUrl);
    const data = await response.json();

    // Enriched response with YOUR name everywhere
    const enrichedResponse = {
      ...data,
      key_details: {
        expiry_date: keyData.expiry_date,
        days_remaining: keyData.days_remaining,
        status: keyData.status,
        used_today: keyData.used_today,
        remaining_today: keyData.daily_limit - keyData.used_today
      },
      cached: false,
      proxyUsed: true,
      api_developer: "@AkashExploits",           // ← YOUR NEW NAME
      BUY_API: "@AkashExploits",                  // ← YOUR NEW NAME
      SUPPORT: "@AkashExploits",                  // ← YOUR NEW NAME
      owner: "https://t.me/AkashExploits \n BUY INSTANT CHEAP PRICE",
      powered_by: "@AkashExploits",                // ← YOUR NEW NAME
      source: "@AkashExploits"                     // ← YOUR NEW NAME
    };

    return res.json(enrichedResponse);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch from external API',
      details: error.message
    });
  }
};
