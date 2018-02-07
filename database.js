const mongoose = require('mongoose');
const Promise = require('bluebird');
const mongo = require('mongodb');

const Schema = mongoose.Schema;

Promise.promisifyAll(mongoose);
Promise.promisifyAll(mongo);

mongoose.connect('mongodb://localhost/local');
const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const siteSchema = mongoose.Schema({
  url: String,
  html: String,
});

const Site = mongoose.model('Site', siteSchema);

const jobSchema = mongoose.Schema({
  url: String,
});

const Job = mongoose.model('Job', jobSchema);

// add sites function
const addSite = (url, html) => {
  const newSite = new Site({ url, html });
  return newSite.save();
};

// get sites function
const getSite = url => Site.findAsync({ url });

const addJob = (url) => {
  const newJob = new Job({ url });
  return newJob.saveAsync();
};

const getJob = _id => Job.findAsync({ _id });

module.exports.addSite = addSite;
module.exports.getSite = getSite;
module.exports.addJob = addJob;
module.exports.getJob = getJob;
