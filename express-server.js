const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const db = require('./database.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const jobQueue = {};

// route for initial job request to add to queue
app.post('/addToQueue', (req, res) => {
  // add url to database and get a unique id
  db.addJob(req.body.url)
    .then((success) => {
    // add the url to the queue with unique id as a key
      jobQueue[success._id] = req.body.url;
      // send the user the unique key
      res.send(JSON.stringify(success._id));
    })
    .catch(err => res.send(err));
});

// route for checking job status
app.get('/jobStatus?:jobId', (req, res) => {
  // check if job id exists
  db.getJob(req.query.jobId)
    .then((job) => {
      // since jobid exists, grab the HTML
      db.getSite(job[0].url)
        // send the HTML to the user
        .then((siteData) => { res.send(siteData.html); })
        // if HTML isn't in db yet, it's still being worked on
        .catch(res.send('Job is still in progress'));
    })
  // if jobId isn't in the db then the user entered invalid jobId
    .catch(err => res.send('Job does not exist'));
});

// worker to perform work on jobQueue
setInterval(() => {
  // for each job in the jobQueue
  for (const job of jobQueue.keys) {
    // check if each job(url) is already in the db
    db.getSite(jobQueue[job])
      .then((siteFound) => {
        // if url already exists in db
        if (siteFound.length !== 0) {
          // delete the url from queue cause work is already done
          delete jobQueue[job];
        // otherwise url isn't in db yet
        } else {
          // grab site html
          axios.get(`http://${jobQueue[job]}`)
            // save url and html to db
            .then(data => db.addSite(jobQueue[job], data.data))
            // after the save is done, delete from queue
            .then(addedSite => delete jobQueue[job])
            .catch(err => console.error(err));
        }
      });
  }
}, 3000);

app.listen(8080, () => console.log('express node listening on port 8080'));
