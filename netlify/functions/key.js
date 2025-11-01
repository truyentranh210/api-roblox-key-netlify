// netlify/functions/key.js
// GET /key
// Requires process.env.KEY_SECRET

const crypto = require("crypto");

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

exports.handler = async (event) => {
  const secret = process.env.KEY_SECRET;
  if (!secret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "KEY_SECRET not configured" }),
    };
  }

  // create payload
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 24 * 3600; // 24 hours
  const payload = {
    iat: now,
    exp,
    rnd: crypto.randomBytes(12).toString("hex"),
  };

  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const token = `${payloadB64}.${sig}`;

  const response = {
    key: token,
    expires_at: new Date(exp * 1000).toISOString(),
    note: "This key is valid for 24 hours. Use as query param or Authorization as you like."
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response, null, 2)
  };
};
