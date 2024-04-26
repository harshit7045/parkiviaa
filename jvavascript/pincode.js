const url = 'https://india-pincode-api.p.rapidapi.com/v1/in/places/pincode/ayodhya';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'da9f7eefe4mshb03d7d2e86b88dbp1c2559jsn78e61fdfd2ba',
		'X-RapidAPI-Host': 'india-pincode-api.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}