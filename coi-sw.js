// Enables cross-origin isolation for the recitation page only, so the
// Quran-recitation model can use several processor threads.
// Other pages in this folder (such as the Nafis platform) are left untouched.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode !== 'navigate' || !/tasmee-[^/]*\.html$/.test(url.pathname)) return;
  e.respondWith(fetch(req).then(res => {
    if (!res || res.status === 0) return res;
    const h = new Headers(res.headers);
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Cross-Origin-Embedder-Policy', 'credentialless');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }).catch(() => fetch(req)));
});
