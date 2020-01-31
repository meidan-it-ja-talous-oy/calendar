const EventService = require('./Services/EventService');
var express = require('express');
const cors = require('cors')
var app = express();

var corsOptions = {
	  origin: '*',
	  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json());

app.get('/', function (req, res) {
    res.send('Rest up');
});

app.get('/events/:emailAddresses', EventService.listEvents);

app.get('/events/week/:emailAddresses', EventService.listWeekEvents);


app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

