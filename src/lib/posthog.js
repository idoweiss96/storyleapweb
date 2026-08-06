import posthog from 'posthog-js';
import { base44 } from '@/api/base44Client';

let initPromise = null;
let isReady = false;

// Loads config from the backend (secrets are never exposed to the frontend directly)
// and initializes PostHog once. Safe to call multiple times.
export function initPostHog() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const res = await base44.functions.invoke('getPostHogConfig', {});
      const { api_key, host } = res.data || {};
      if (!api_key || !host) return;
      posthog.init(api_key, {
        api_host: host,
        capture_pageview: false, // pageviews are fired manually on route change
        autocapture: true,
        session_recording: {
          maskAllInputs: false, // only inputs marked with the "ph-mask" class are masked
        },
      });
      isReady = true;
    } catch (_) {
      // Analytics must never break the app
    }
  })();
  return initPromise;
}

export function trackPageview(path) {
  if (!isReady) return;
  try { posthog.capture('$pageview', { path }); } catch (_) {}
}

export function trackEvent(name, properties) {
  if (!isReady) return;
  try { posthog.capture(name, properties); } catch (_) {}
}

export function stopTracking() {
  if (!isReady) return;
  try { posthog.opt_out_capturing(); } catch (_) {}
}

export function resumeTracking() {
  if (!isReady) return;
  try { posthog.opt_in_capturing(); } catch (_) {}
}