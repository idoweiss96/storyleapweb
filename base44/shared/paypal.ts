// Shared PayPal REST API helpers used by the credits-order backend functions.
// Extracted here so createCreditsOrder / captureCreditsOrder / paypalWebhook
// never duplicate the access-token or webhook-verification logic.

const PAYPAL_BASE = 'https://api-m.paypal.com';

export async function getPaypalAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

// Verifies a PayPal webhook signature.
// Returns true (valid), false (invalid), or null (PAYPAL_WEBHOOK_ID not configured
// — caller may still process the event but should log a warning).
export async function verifyPaypalWebhook(headers, body) {
  const webhookId = Deno.env.get('PAYPAL_WEBHOOK_ID');
  if (!webhookId) return null;
  const accessToken = await getPaypalAccessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}