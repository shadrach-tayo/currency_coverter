class Converter {
	constructor() {

		this.convertCurrency = this.convertCurrency.bind(this);

		this.getCurrencyList();
		this.initializeInputs();
	}

	getCurrencyList() {

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
				let value = amount * rate;
				value = Math.round(value * 100 / 100);
				console.log(value);
				this.displayCurrencyResult(value);
			})
			.catch(err => console.log(err));

	}

	displayCurrencyResult(value) {
		this.inputToConvertTo.value = value;
		this.inputToConvertTo.focus();
	}
}

const App = new Converter();