require('dotenv').config();

const ttn = require('ttn');

const config = require('./config.json'),
  AppModel = require('../models/App'),
  DeviceModel = require('../models/Device'),
  PayloadModel = require('../models/Payload'),
  // eslint-disable-next-line no-unused-vars
  db = require('./db');


async function callAllApis () {
  await Promise.all(config.map(async (el) => {
    const client = await ttn.data(el.appId, el.key);

    client
      .on('uplink', async function(devID, payload){

        const AppExists = await checkForApp(el);

        console.log('Received uplink from ', devID);
        console.log(payload);

      });
  }));
}

callAllApis()
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });

async function checkForApp(data) {
  AppModel.findOne({'uniqueId': data.uniqueId}, function(err, app) {
    if (!app) {
      console.log('App not found, creating new entry');
      //createNewApp(data);
      console.log('I would enter this? ' + data);
      return;
    } else {
      console.log('App found!');
      return;
    }
  });
}

async function createNewApp(data) {

}
