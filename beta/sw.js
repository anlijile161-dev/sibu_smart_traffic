const CACHE='sst-beta-plus-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  e.respondWith((async()=>{
    try {
      const res = await fetch(e.request);
      return res;
    } catch(err){
      const cached = await caches.match(e.request);
      if (cached) return cached;
      if (e.request.mode === 'navigate') return caches.match('./index.html');
      throw err;
    }
  })());
});
