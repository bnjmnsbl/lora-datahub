//enable evironment variables
require('dotenv').config();

const ttn = require('ttn');

const config = require('./config.json'),
  appModel = require('../models/ttnApp'),
  // eslint-disable-next-line no-unused-vars
  db = require('./db');

config.forEach((el) => {

  ttn.data(el.appId, el.key)
    .then((client)=> {
      console.log('connected: ' + el.appId);

      client.on('uplink', (function(devId, payload) {
        console.log('received uplink from ' + devId + ' . Saving to DB...');
        console.dir(payload);

        let data = {
          app: payload
        };
        let newApp = new appModel(data);

        newApp.save(function(err, data) {
          if (err) throw err;
          console.log('Saved to DB' + data);
        });
      }));
    });
});

