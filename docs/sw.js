const staticCacheName = 'site-static';
const dynamicCache = 'site-dynamic';
const assets = [
'./',
'index.html',
'style.css',
'app.js',
'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
];

self.addEventListener('install', evt =>{
	evt.waitUntil(
		caches.open(staticCacheName).then(cache=>{
			cache.addAll(assets);
		})
	);
});

self.addEventListener('activate', evt =>{
	evt.waitUntil(
		caches.keys().then(keys=>{
			return Promise.all(keys
				.filter(key=>key !== staticCacheName)
				.map(key=>{caches.delete(key)}))
		})
	);
});

self.addEventListener('fetch', evt =>{
	evt.respondWith(
		caches.match(evt.request).then(cacheRes=>{
			return cacheRes || fetch(evt.request).then(fetchRes =>{
				return caches.open(dynamicCache).then(cache=>{
					cache.put(evt.request.url, fetchRes.clone());
					return fetchRes;
					})
			});
		})
	);
});