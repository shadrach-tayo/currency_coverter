let staticCacheName = 'converter-v2';
let currencyListCache = 'currencyList';
let currencyValueCache = 'currencyValue';

let allCaches = [
	staticCacheName,
	currencyListCache,
	currencyValueCache
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticCacheName).then(cache => {
			console.log('adding all')
			return cache.addAll([
				'css/styles.css',
				'js/app.js',
				'/index.html',
			])
		}).catch(err => console.error(err))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => {
				return !allCaches.includes(cacheName);
			}).map(cacheName => caches.delete(cacheName));
		}).catch(err => console.error(err))
	);
});

self.addEventListener('fetch', event => {
	let url = new URL(event.request.url);

	// if(url === '/dist') {
	// 	event.respondWith(caches.match('/index.html'));
	// 	return;
	// }

	if(url.pathName.includes('/assets')) {
		event.respondWith(caches.match('/assets/'));
		return;
	}

	// if(url.pathName === '/assets/css/styles.js') {
	// 	event.respondWith(caches.match('/assets/css/styles.css'))
	// 	return;
	// }

	// if(url.pathName.includes('/free.currencyconverterapi.com/api/v5/currencies')) {
	// 	event.respondWith(serveCurrencyList(event.request));
	// 	return;
	// }

	// if(url.pathName.includes('/free.currencyconverterapi.com/api/v5/convert?q=')) {
	// 	event.respondWith(serveCurrencyValue(event.request));
	// 	return;
	// }

	event.respondWith(
		caches.match(event.request).then(response => {
			console.log('fetching', event.request);
			return response || fetch(event.request);
		})
	)
});

self.addEventListener('message', event => {
	if(event.data.action == 'skipWaiting') {
		console.log('skipWaiting');
		self.skipWaiting();
	}
})


function serveCurrencyList(request) {

}

function serveCurrencyValue(request) {

}