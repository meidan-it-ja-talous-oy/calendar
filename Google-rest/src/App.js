var express = require('express');
const events = require('./events');
const cors = require('cors')
const gService = require('./services/gServices.js')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

var app = express();

app.use(express.json());
app.use(cors(corsOptions))

app.get('/', function (req, res) {
    res.send('Up and running.');
});

app.get('/events/:emailAddresses', events.listEvents);

app.get('/weekevents/:emailAddresses', events.listWeekEvents);

app.get('/events/week/:emailAddresses', events.listEventsWeekly);

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});