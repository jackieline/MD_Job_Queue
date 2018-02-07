const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const db = require('.database.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, }));

let jobQueue = {};

// route for initial job request to add to queue
app.post('/addToQueue', (req, res) => {

});

// route for checking job status
app.get('/jobStatus?:jobId', (req, res) => {

});

app.listen(8080, () => console.log('express node listening on port 8080'));
