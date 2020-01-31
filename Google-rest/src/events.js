const { google } = require('googleapis');
const calendar = google.calendar('v3');
const jwtClient = require('./services/gServices.js');
var forEach = require('async-foreach').forEach;

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

function getWeekFromNow() {
	var date = new Date();
    var day = date.getDay();
    var weekFromNow;
    weekFromNow = new Date().setDate(date.getDate() + 7);
    weekFromNow = getFormattedDate(weekFromNow);
    return weekFromNow;
}

function getNextSunday() {
    var date = new Date();
    var day = date.getDay();
    var nextSunday;
    nextSunday = new Date().setDate(date.getDate() + (7-day));
    nextSunday = getFormattedDate(nextSunday);
    return nextSunday;
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
async function loadWeekEvents(email) {
	var weekFromNow = getWeekFromNow();
	return new Promise((resolve, reject) => {
		calendar.events.list({
			auth: jwtClient,
			calendarId: email,
			timeMin: (new Date()).toISOString(),
			timeMax: new Date(weekFromNow).toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, response) => {
			if(err) {
				reject("No events")
			}
			resolve(response.data);
		});
	});
}
async function loadEvents(email) {
	return new Promise((resolve, reject) => {
		calendar.events.list({
			auth: jwtClient,
			calendarId: email,
			timeMin: (new Date()).toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, response) => {
			if(err) {
				reject("No events")
			}
			resolve(response.data);
		});
	});
}
async function loadEventsWeekly(email) {
	return new Promise((resolve, reject) => {
		var monday = getPreviousMonday();
		var sunday = getNextSunday();
		calendar.events.list({
			auth: jwtClient,
			calendarId: email,
			timeMin: new Date(monday).toISOString(),
			timeMax: new Date(sunday).toISOString(),
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, response) => {
			if(err) {
				reject("No events")
			}
			resolve(response.data);
		});
	});
}
async function mergeData(master, result, email){
	return new Promise((resolve, reject) => {
		master.push({email: email, data: result});
		resolve(master);
	});
}

module.exports = {
	listEvents(req, res, next) {
		var events = [];
		var emails = req.params.emailAddresses.split(",");
		for(let index = 0; index < emails.length; index++){
			const email = emails[index];
			loadEvents(email).then(function(result) {
				mergeData(events, result, email).then(function(master){
					if(master.length === emails.length){
						res.status(200).json(master);
					}
				});
			});
		}
	},
	listWeekEvents(req, res, next) {
		var events = [];
		var emails = req.params.emailAddresses.split(",");
		for(let index = 0; index < emails.length; index++){
			const email = emails[index];
			loadWeekEvents(email).then(function(result) {
				mergeData(events, result, email).then(function(master){
					if(master.length === emails.length){
						res.status(200).json(master);
					}
				});
			});
		}
	},
	listEventsWeekly(req, res, next) {
		var events = [];
		var emails = req.params.emailAddresses.split(",");
		for(let index = 0; index < emails.length; index++){
			const email = emails[index];
			loadEventsWeekly(email).then(function(result) {
				mergeData(events, result, email).then(function(master){
					if(master.length === emails.length){
						res.status(200).json(master);
					}
				});
			});
		}
	}
}