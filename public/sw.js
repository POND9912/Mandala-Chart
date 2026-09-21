// Minimal service worker for the prototype.
//
// What works today: registering this SW is what makes the app installable
// (Add to Home Screen / desktop install), which iOS in particular requires
// before it will show ANY notification from this site at all.
//
// What's stubbed for later: the 'push' handler below is where a real push
// message from your backend would arrive and turn into an OS notification.
// There's no backend sending pushes yet, so this never fires on its own —
// see README.md "Notifications" for what else is needed. When a backend
// does send one, its payload should carry a chart-aware body and a deep
// link (e.g. { title: chartTitle, body: `${subgoalTitle} • ${actionLabel}`,
// url: `/chart/${chartId}/subgoal/${subgoalId}` }) — see
// randomDailyAction() in lib/data.js for the selection logic this should
// mirror server-side.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Mandala AI';
  const body = data.body || 'วันนี้คุณทำเป้าหมายไปถึงไหนแล้ว?';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      data: { url: data.url || '/gallery' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/gallery';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
