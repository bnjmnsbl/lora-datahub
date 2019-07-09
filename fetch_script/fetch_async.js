require('dotenv').config({path:__dirname+'/./../.env'});

const ttn = require('ttn');

const config = require('./config.json'),
  AppModel = require('../models/App'),
  DeviceModel = require('../models/Device'),
  PayloadModel = require('../models/Payload'),
  // eslint-disable-next-line no-unused-vars
  db = require('./db');


async function main () {
  await Promise.all(config.map(async (el) => {

    const client = await ttn.data(el.appId, el.key);

    client
      .on('uplink', async function(devID, payload){
        console.log('received ping by ' + devID);

        let app = await appExists(el.uniqueId);

        if (app) {
          console.log('App found! Looking for Device');
          let device = await deviceExists(app._id, devID);

          if (device) {
            // Device found, saving only payload
            console.log('Device found');
            await savePayload(device._id, payload.metadata.time, payload.payload_fields);

          } else {
            // Device not found, creating new device and save payload;
            console.log('Device not found');
            let device = await saveDevice(app._id, devID, payload.hardware_serial);
            await savePayload(device._id, payload.metadata.time, payload.payload_fields);
          }
        } else {
          console.log('App not found!');
          let app = await saveApp(el);
          let device = await saveDevice(app._id, devID, payload.hardware_serial);
          await savePayload(device._id, payload.metadata.time, payload.payload_fields);
        }
      });
  }));
}

/**
 * Checks if an App is already present in the MongoDB.
 *
 * @param {String} id Unique ID of the TTN App
 * @returns {Object} If present, returns app. If not, returns undefined
 */
const appExists = (id) => {
  return AppModel.findOne({'uniqueId': id})
    .exec()
    .then((app) =>{
      console.log('looking for app with unique id' + id);
      return app;
    })
    .catch((err) => {
      return err;
    });
};

/**
 * Checks if a device is already present in the MongoDB.
 *
 * @param {String} id Unique ID of the TTN App
 * @returns {Object} If present, returns app. If not, returns undefined
 */

const deviceExists = (appId, devId) => {
  return DeviceModel.findOne({'parentApp': appId, 'devId': devId})
    .exec()
    .then((device) => {
      return device;
    })
    .catch((err) => {
      return err;
    });
};

/**
 * Saves a new TTN App to MongoDB
 * @param {Object} data The data object for the app.
 */
function saveApp(el) {
  let appData = {
    'appId': el.appId,
    'uniqueId': el.uniqueId,
    'description': el.description,
    'locationName': el.locationName,
    'user': el.user
  };

  let App = new AppModel(appData);

  return App.save()
    .then((app) => {
      console.log('Saved new App ' + app.appId + 'to the database.');
      return app;
    }).catch((err) => {
      return err;
    });
}

/**
 *
 * @param {*} appId The MongoDB ID of the parent app;
 * @param {*} devId The device ID
 * @param {*} hardwareSerial The hardware serial of the device
 */
function saveDevice(appId, devId, hardwareSerial) {
  let deviceData = {
    'parentApp': appId,
    'devId': devId,
    'hardwareSerial': hardwareSerial
  };

  let Device = new DeviceModel(deviceData);

  return Device.save()
    .then((device) => {
      console.log('Saved new device ' + devId + 'to App with Id ' + appId);
      return device;
    }).catch((err) => {
      return err;
    });

}

/**
 * Saves a payload with the according device, time and values
 *
 * @param {String} devId The Device ID
 * @param {String} time Timestamp as a String
 * @param {Object} fields The payload value object
 */

function savePayload(devId, time, fields){

  let payloadData = {
    'parentDevice': devId,
    'timestamp': time,
    'payload': fields
  };

  let Pay = new PayloadModel(payloadData);
  return Pay.save()
    .then((pay) => {
      console.log('Payload added: ' + pay);
    }).catch((err) => {
      return err;
    });

}


/**
 * Main function
 */

main()
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });
