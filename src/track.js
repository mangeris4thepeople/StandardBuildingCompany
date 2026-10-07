// GA4 event helpers. Mark `generate_lead` and `phone_call_click` as key events in GA4
// to see which pages produce calls and form submissions.
export function track(event, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, { page_path: window.location.pathname, ...params });
}

export function initLinkTracking() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('tel:')) track('phone_call_click', { link_url: href });
    else if (href.startsWith('mailto:')) track('email_click', { link_url: href });
  });
}
