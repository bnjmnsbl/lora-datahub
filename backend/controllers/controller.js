/* eslint-disable no-unused-vars */
const boom = require('boom');

const AppModel = require('../../models/App'),
  DeviceModel = require('../../models/Device'),
  PayloadModel = require('../../models/Payload');


exports.getApps = async (req, reply) => {
  try {
    const apps = await AppModel.find();
    return apps;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getSingleApp = async (req, reply) => {
  try {
    const id = req.params.id;
    const app = await AppModel.findById(id);
    return app;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getDevices = async (req, reply) => {
  try {
    const appId = req.params.id;
    const devices = await DeviceModel.find({'parentApp': appId});
    return devices;
  } catch (err) {
    throw boom.boomify(err);
  }
};

exports.getPayloadsforDevice = async (req, reply) => {
  try {
    const devId = req.params.id;
    const payloads = await PayloadModel.find({'parentDevice': devId});
    return payloads;
  } catch (err) {
    throw boom.boomify(err);
  }
};
