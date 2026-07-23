import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SIGNUP_BONUS = 10;

// Grants 10 welcome credits to a new user on their first onboarding completion.
// Idempotent: uses the onboarding_completed flag — if already completed, no grant.
// Sets onboarding_completed = true atomically with the credit grant.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    if (!dbUser) return Response.json({ error: 'User not found' }, { status: 404 });

    // Idempotency: only grant if onboarding not yet completed
    if (dbUser.onboarding_completed) {
      return Response.json({ success: true, already_claimed: true, credits: dbUser.credits || 0 });
    }

    const newCredits = (dbUser.credits || 0) + SIGNUP_BONUS;
    await base44.asServiceRole.entities.User.update(dbUser.id, {
      credits: newCredits,
      onboarding_completed: true,
    });
    console.log(`[claimSignupBonus] Granted ${SIGNUP_BONUS} credits to ${user.email}, new total: ${newCredits}`);

    return Response.json({ success: true, granted: SIGNUP_BONUS, new_total: newCredits });
  } catch (error) {
    console.error('[claimSignupBonus] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});