const axios = require('axios');

//Add secret, tenant and clientId from Azure active directory admin center
const secret = "";
const tenant = "";
const clientId = "";
const BASE_URL = "https://graph.microsoft.com";

function getPreviousMonday() {
    var date = new Date();
    var day = date.getDay();
    var prevMonday;
    if(date.getDay() == 0){
        prevMonday = new Date().setDate(date.getDate() - 7);
    }
    else{
        prevMonday = new Date().setDate(date.getDate() - day);
    }
    prevMonday = getFormattedDate(prevMonday);
    return prevMonday;
}

function getNextSunday() {
    var date = new Date();
    var day = date.getDay();
    var nextSunday;
    nextSunday = new Date().setDate(date.getDate() + (7-day));
    nextSunday = getFormattedDate(nextSunday);
    return nextSunday;
}
function getWeekFromNow() {
	var date = new Date();
    var weekFromNow = new Date().setDate(date.getDate() + 7);
    return new Date(weekFromNow);
}
function getFormattedDate(dateString) {
	   var date = new Date(dateString);
	   if(date.getDay() == 1) {
		   date.setHours(0, 0, 0); 
	   } else {
		   date.setHours(23, 59, 59);
	   }
	   return date;
}

async function loadEvents(token, email) {
	var start = new Date().toISOString();
	var end = getWeekFromNow().toISOString();
	const config = {
			headers: {
				Accept: 'application/json',
				'Authorization': 'Bearer '+token,
				Host: 'graph.microsoft.com',
				Prefer: 'outlook.timezone="FLE Standard Time"'
			}
	};
	return new Promise((resolve, reject) => {
		axios.get(BASE_URL + '/v1.0/users/'+ email +'/calendarView?startDateTime='+start+'&endDateTime='+end + '&limit=100', config)
		  .then(response => {
			  resolve(response.data);
		  }, error => {
			 resolve(error.toJSON());
		  });
		  
	});
}
async function mergeSubEvents(master, single){
	return new Promise((resolve, reject) => {
		master.value.push(single.value);
		resolve(master);
	});
}
async function loadWeekEvents(token, email) {
	var start = getPreviousMonday().toISOString();
	var end = getNextSunday().toISOString();
	const config = {
			headers: {
				Accept: 'application/json',
				'Authorization': 'Bearer '+token,
				Host: 'graph.microsoft.com',
				Prefer: 'outlook.timezone="FLE Standard Time"'
			}
	};
	return new Promise((resolve, reject) => {
		axios.get(BASE_URL + '/v1.0/users/'+ email +'/calendarView?startDateTime='+start+'&endDateTime='+end + '&limit=100', config)
		  .then(response => {
			  resolve(response.data);
		  }, error => {
			 resolve(error.toJSON());
		  });
		  
	});
}
async function createToken() {
	return new Promise((resolve, reject) => {
		axios.post('https://login.microsoftonline.com/'+ tenant +'/oauth2/v2.0/token', "client_id="+clientId+"&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret="+ secret +"&grant_type=client_credentials")
		  .then(response => {
			  if(response.data.access_token) {
				  resolve(response.data.access_token);
			  }
		  });
	});
}

async function mergeData(master, result, email){
	return new Promise((resolve, reject) => {
		master.push({email: email, data: result});
		resolve(master);
	});
}

async function formatData(dataset){
	let json = [];
	return new Promise((resolve, reject) => {
		dataset.forEach(function(singleAccount){
			let jObj = {email: singleAccount.email, data: { items:[] } };
			singleAccount.data.value.forEach(function(event){
				jObj.data.items.push({
					start: {dateTime: event.start.dateTime},
					end: {dateTime: event.end.dateTime},
					description: event.body.content,
					summary: event.subject,
					htmlLink: event.webLink,
					location: event.location.displayName
				});
			});
			json.push(jObj);
		});
		resolve(json);
	});
}

module.exports = {
		listEvents(req, res, next) {
			var events = [];
			var emails = req.params.emailAddresses.split(",");
			createToken().then(function(token) {
				for(let index = 0; index < emails.length; index++){
					const email = emails[index];
					loadEvents(token, email).then(function(result) {
						mergeData(events, result, email).then(function(master){
							if(master.length === emails.length){
								formatData(master).then(function(json){
									res.status(200).json(json);
								});
							}
						});
					});
				}
			});
		},
		listWeekEvents(req, res, next) {
			var events = [];
			var emails = req.params.emailAddresses.split(",");
			createToken().then(function(token) {
				for(let index = 0; index < emails.length; index++){
					const email = emails[index];
					loadWeekEvents(token, email).then(function(result) {
						mergeData(events, result, email).then(function(master){
							if(master.length === emails.length){
								formatData(master).then(function(json){
									res.status(200).json(json);
								});
							}
						});
					});
				}
			});
		},
		createToken(req, res, next) {
			createToken().then(function(result) {
				res.status(200).json(result);
			});
		}
}
