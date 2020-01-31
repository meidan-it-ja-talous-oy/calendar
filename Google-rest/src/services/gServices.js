const { google } = require('googleapis');
const credentials = require('../../config/credentials.json');

const jwtClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	['https://www.googleapis.com/auth/calendar']
);

jwtClient.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	} else {
		console.log("Successfully connected!");
	}
});

module.exports = jwtClient