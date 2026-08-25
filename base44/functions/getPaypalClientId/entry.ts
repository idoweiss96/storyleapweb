// No auth required: a PayPal client ID is not a secret — it's embedded in the public
// PayPal JS SDK script URL anyway. Guests need this too, to pay for a single story
// without creating an account.
Deno.serve(async (req) => {
  try {
    return Response.json({ client_id: Deno.env.get('PAYPAL_CLIENT_ID') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});