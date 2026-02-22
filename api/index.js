// api/index.js
// Unlimited Proxy API with Total Re-Branding

const KEY_STORE = {
  "AKASH_PAID3MONTH": {
    name: "Premium Unlimited Key",
    expiry_date: "2026-12-31",
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
  
  const { key, type, term } = req.query;

  if (!key || !type || !term) {
    return res.status(400).json({ success: false, error: 'Parameters missing' });
  }

  const keyData = KEY_STORE[key];
  if (!keyData) return res.status(403).json({ success: false, error: 'Invalid Key' });

  try {
    const externalUrl = `${EXTERNAL_API.baseUrl}?key=${EXTERNAL_API.key}&type=${encodeURIComponent(type)}&term=${encodeURIComponent(term)}`;
    const response = await fetch(externalUrl);
    const data = await response.json();

    // --- RE-BRANDING LOGIC ---
    // Purane labels ko delete kar rahe hain taaki aapka naam hi rahe
    delete data.BUY_API;
    delete data.SUPPORT;
    delete data.api_developer;
    delete data.owner;

    // Naya Response Structure
    const finalResponse = {
      status: data.status || true,
      data: data.data || [],
      BUY_API: "@Akash_Exploits_bot",          // ← Fixed!
      SUPPORT: "@Akash_Exploits_bot",          // ← Fixed!
      api_developer: "@Akash_Exploits_bot",    // ← Fixed!
      owner: "https://t.me/Akash_Exploits_bot",// ← Fixed!
      key_details: {
        status: "Unlimited Access",
        expiry: keyData.expiry_date,
        info: "No daily limit applied by Akash"
      },
      powered_by: "TITAN V6 HYPERION SYSTEM",
      copyright: "© 2026 @Akash_Exploits_bot"
    };

    return res.json(finalResponse);

  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
