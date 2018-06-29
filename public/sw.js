let staticCacheName = 'converter-v1';
let currencyListCache = 'currencyList';
let currencyValueCache = 'currencyValue-1';

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
				'/dist/assets/css/styles.css',
				'/dist/assets/js/app.js',
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

self.addEventListener('onerror', event => {
	console.error(event);
})

self.addEventListener('fetch', event => {
	let url = new URL(event.request.url);
	console.log(url);
	if(url.pathName == '/api/v5/convert') {
		event.respondWith(serveCurrencyValue(event.request));
		return;
	}

	event.respondWith(
		caches.match(event.request).then(response => {
			// console.log('fetching', event.request);
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

	let queryUrl = queryRegex.exec(url.search)[1];
	console.log(queryUrl);
	return caches.open(currencyValueCache).then(cache => {
		cache.match(queryUrl).then(response => {
			let networkFetch = fetch(request).then(networkResponse => {
				cache.put(queryUrl, networkResponse.clone());
				return networkResponse;
			})	
			return response || networkFetch;
		})
	})
}