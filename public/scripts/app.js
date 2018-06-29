class Converter {
	constructor() {
		this.fetchData = this.fetchData.bind(this);
		this.convertCurrency = this.convertCurrency.bind(this);
		this.updateCurrencyList = this.updateCurrencyList.bind(this);

		// bindings to worker functions
		this.updateWorker = this.updateWorker.bind(this);
		this.trackInstalling = this.trackInstalling.bind(this);
		this.registerServiceWorker = this.registerServiceWorker.bind(this);

		// url from FreecurrencyConverter Api to get currencyList
		this.currencyListURL = 	`https://free.currencyconverterapi.com/api/v5/currencies`;

		this.getCurrencyList();
		this.initializeInputs();
		this.registerServiceWorker();
	}

	registerServiceWorker() {
		if(!navigator.serviceWorker) return;

		navigator.serviceWorker.register('/dist/sw.js', {scope: '/dist/'})
		.then(reg => {
			let serviceWorker;
			if(reg.installing) {
				serviceWorker = reg.installing;
				console.log("serviceWorker is installing");
			} else if(reg.waiting) {
				serviceWorker = reg.waiting;
				console.log("serviceWorker is waiting");
				this.trackInstalling(serviceWorker);
			} else if(reg.active) {
				serviceWorker = reg.active;
				console.log("serviceWorker is active");
			}

			if(serviceWorker) {
				console.log('there is a worker');
			}

			reg.addEventListener('updatefound', () => {
				this.trackInstalling(reg.installing);
			});
		});
	}

	trackInstalling(worker) {
		worker.addEventListener('statechange', () => {
			if(worker.state == 'installed') {
				this.updateWorker(worker);
			}
			console.log(worker.state);
		})
	}

	updateWorker(worker) {
		worker.postMessage({action: 'skipWaiting'});
		console.log('worker-updated');
	}

	fetchData(url, jsonFormat = true) {
		return fetch(url)
			.then(response => {
				if(jsonFormat)
					return response.json();
				return response;
			})
			.catch(err => console.error(err));
	}

	getCurrencyList() {
		let getCurrencyData = this.fetchData(this.currencyListURL);
		getCurrencyData.then(response => {
			let list = response["results"];
			if(list !== undefined)
				return this.updateCurrencyList(list);
		})
		.catch( err => console.error(err))
	}

	initializeInputs() {
		this.inputToConvertFrom = document.querySelector('.js-currency-input');
		this.inputToConvertTo = document.querySelector('.js-currency-output');
		this.currencyToConvertFrom = document.getElementById('js-currency-from');
		this.currencyToConvertTo = document.getElementById('js-currency-to');

		this.inputToConvertFrom.addEventListener('change', this.convertCurrency);
		this.currencyToConvertFrom.addEventListener('change', this.convertCurrency);
		this.currencyToConvertTo.addEventListener('change', this.convertCurrency);
	}

	convertCurrency(e, amount = this.inputToConvertFrom.value,
					currencyFrom = this.currencyToConvertFrom.value,
					currencyTo = this.currencyToConvertTo.value
					) {
		currencyTo = encodeURIComponent(currencyTo);
		currencyFrom = encodeURIComponent(currencyFrom);
		let query = `${currencyFrom}_${currencyTo}`;
		const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`;
		console.log(query, url);

		// make call to api
		fetch(url).then(response => response.json())
			.then(result => {
				let rate = result[`${query}`].val;
				if(rate !== undefined) {
					let value = amount * rate;
					console.log(value);
					value = Math.round(value * 100 / 100);
					console.log(value);
					this.displayCurrencyResult(value);
				};
			})
			.catch(err => console.error(err));
	}

	displayCurrencyResult(value) {
		this.inputToConvertTo.value = value;
		this.inputToConvertTo.focus();
	}


	updateCurrencyList(currencyData) {
		let optionList = '';
		console.log(currencyData);
		for(let currency in currencyData) {
			let {currencyName, id } = currencyData[currency];
			optionList +=`<option value=${id}>${id} (${currencyName})</option>`;
		}	
		this.currencyToConvertFrom.innerHTML = optionList;
		this.currencyToConvertTo.innerHTML = optionList;
	}
}

let refreshing;
navigator.serviceWorker.addEventListener('controllerchange', event => {
	if(refreshing) return;
	window.location.reload();
	refreshing = true;
});

const App = new Converter();