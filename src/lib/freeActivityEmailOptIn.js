import { base44 } from '@/api/base44Client';

function showThanks(wrap) {
  if (!wrap) return;
  const body = wrap.querySelector('[data-fa-optin-body]');
  const thanks = wrap.querySelector('[data-fa-optin-thanks]');
  if (body) body.style.display = 'none';
  if (thanks) thanks.style.display = 'block';
}

// Uses event delegation on the container so it keeps working even if the
// activity's own vanilla-JS engine re-renders the screen HTML internally.
export function attachEmailOptIn(container, activityKey) {
  if (!container) return;

  container.addEventListener('submit', async (e) => {
    const form = e.target.closest('[data-fa-optin-form]');
    if (!form) return;
    e.preventDefault();
    const wrap = form.closest('[data-fa-optin]');
    const input = form.querySelector('[data-fa-optin-email]');
    const email = input ? input.value.trim() : '';
    if (!email) return;
    try {
      await base44.entities.FreeActivityLead.create({ email, activity: activityKey });
    } catch (err) {
      // fail silently, this is a purely optional, best-effort capture
    }
    showThanks(wrap);
  });

  container.addEventListener('click', (e) => {
    const skip = e.target.closest('[data-fa-optin-skip]');
    if (!skip) return;
    showThanks(skip.closest('[data-fa-optin]'));
  });
}