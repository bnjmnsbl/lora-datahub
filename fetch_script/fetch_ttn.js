//enable evironment variables
require('dotenv').config();

const ttn = require('ttn');

const config = require('./config.json'),
  AppModel = require('../models/App'),
  DeviceModel = require('../models/Device'),
  PayloadModel = require('../models/Payload'),
  // eslint-disable-next-line no-unused-vars
  db = require('./db');

config.forEach((el) => {

  ttn.data(el.appId, el.key)
    .then((client)=> {
      console.log('connected to ' + el.appId);

      client.on('uplink', (function(devId, payload) {
        console.log('received uplink from ' + devId);
        console.log(payload);

        //check if app id already exists
        AppModel.findOne({'uniqueId': el.uniqueId}, function(err, app) {
          if (!app) {
            console.log('App not found, creating new entry');

            let appData = {
              'appId': el.appId,
              'uniqueId': el.uniqueId,
              'description:': el.description,
              'locationName': el.locationName
            };
            let App = new AppModel(appData);

            App.save(function(err, doc) {
              if (err) throw err;
              console.log('Saved new App ' + doc.appId);
            });

            let deviceData = {
              'parentApp': App._id,
              'devId': devId,
              'hardwareSerial': payload.hardware_serial
            };

            let Device = new DeviceModel(deviceData);

            Device.save(function(err, dev) {
              if (err) throw err;
              console.log('Device saved succesfully' + dev);
            });

            let payloadData = {
              'parentDevice': Device._id,
              'timestamp': payload.metadata.time,
              'payload': payload.payload_fields
            };

            let Pay = new PayloadModel(payloadData);

            Pay.save(function(err, pay) {
              console.log('Initial Payload saved: ' + pay);
            });
          } else {
            //app found, check if device exists
            console.log('App found in DB');

            DeviceModel.findOne({'parentApp': app._id, 'devId': devId}, function(err, device){
              if (err) throw err;

              if (!device) {
                //device not found, create new device
                console.log('Device not found');

                let deviceData = {
                  'parentApp': app._id,
                  'devId': devId,
                  'hardwareSerial': payload.hardware_serial
                };
                let Device = new DeviceModel(deviceData);

                Device.save(function(err, dev) {
                  if (err) throw err;
                  console.log('Device saved succesfully' + dev);

                  // save initial payload together with device
                  let payloadData = {
                    'parentDevice': Device._id,
                    'timestamp': payload.metadata.time,
                    'payload': payload.payload_fields
                  };

                  let Pay = new PayloadModel(payloadData);

                  Pay.save(function(err, pay) {
                    console.log('Initial Payload saved: ' + pay);
                  });
                });
              } else {
                //Device found, saving only payload
                console.log('Device found!');

                let payloadData = {
                  'parentDevice': device._id,
                  'timestamp': payload.metadata.time,
                  'payload': payload.payload_fields
                };

                let Pay = new PayloadModel(payloadData);
                Pay.save(function(err, pay) {
                  console.log('Payload added: ' + pay);
                });
              }
            });
          }
        });
      }));
    });
});

/**
 * Async function that checks if the TTN App from config is already in the MongoDB Collection. Returns a boolean
 * @param {String} uniqueId Unique ID of the TTN App
 */

// function AppExistsinDB(uniqueId) {
//   return new Promise(function(reject, resolve) {
//     AppModel.findOne({'uniqueId': uniqueId}, function(err, sensor) {
//       if (!sensor) resolve('1');
//       else if (err) reject(err);
//       else return resolve('0');
//     });
//   });
// }
