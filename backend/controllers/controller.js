/* eslint-disable no-unused-vars */
const boom = require('boom');
const bcrypt = require('bcrypt');


const AppModel = require('../../models/App'),
  DeviceModel = require('../../models/Device'),
  PayloadModel = require('../../models/Payload'),
  UserModel = require('../../models/User');


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

exports.getDeviceName = async (req, reply) => {
  try {
    const id = req.params.id;
    const device = await DeviceModel.findById(id);
    return device;
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

exports.getLatestPayloads = async (req, reply) => {
  try {
    const devId = req.params.id;
    const payloads = await PayloadModel.find({'parentDevice': devId}).sort({ '_id': -1 }).limit(5);
    return payloads;
  } catch (err) {
    throw boom.boomify(err);
  }
};


exports.handle404 = async (req, reply) => {
  try {
    return boom.notFound('404 not found');
  } catch (err) {
    throw boom.boomify(err);
  }

};

exports.addNewUser = async (req, reply) => {
  try {
    const user = req.body;

    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) throw err;
        resolve(hash);
      });
    });

    user.password = hashedPassword;

    const User = new UserModel(user);

    return User.save()
      .then((data) => {
        console.log('Saved new User ' + user.name + ' to the database.');

        return data;
      }).catch((err) => {
        return err;
      });

  } catch (err) {
    throw boom.boomify(err);
  }
};

