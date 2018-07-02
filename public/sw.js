let staticCacheName = 'converter-v1';
let currencyValueCache = 'currencyValue-1';

let allCaches = [
	staticCacheName,
	currencyValueCache
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticCacheName).then(cache => {
			console.log('adding all')
			return cache.addAll([
				'/dist/assets/css/styles.css',
				'/dist/assets/js/app.js',
				'/dist/assets/images/favicon.ico',
				'/dist/manifest.json',
				'/dist/',
				'https://free.currencyconverterapi.com/api/v5/currencies'
			])
		})
		.catch(err => console.error(err))
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(cacheName => {
					return !allCaches.includes(cacheName);
				}).map(cacheName => caches.delete(cacheName))
			)
		}).catch(err => console.error(err))
	);
});

self.addEventListener('fetch', event => {
	let url = new URL(event.request.url);

	if(url.pathname == '/api/v5/convert') {
		event.respondWith(serveCurrencyValue(event.request));
		return;
	}

	event.respondWith(
		caches.match(event.request).then(response => {
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
	const queryRegex = /[^(\w*?)](\w*.\w*)(?=&)/g;

	let queryUrl = queryRegex.exec(request.url)[1];
	console.log(queryUrl);
	return caches.open(currencyValueCache).then(cache => {
		return cache.match(queryUrl).then(async response => {
			let networkFetch = await fetch(request).then(networkResponse => {
				cache.put(queryUrl, networkResponse.clone());
				return networkResponse;
			})
			.catch(err => console.error(err));
			console.log(response, networkFetch);
			return response || networkFetch;
		})
	})
}