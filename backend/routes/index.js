//Import our Controllers
const controller = require('../controllers/controller');

const routes = [
  {
    method: 'GET',
    url: '/api/apps',
    handler: controller.getApps
  },
  {
    method: 'GET',
    url: '/api/apps/:id',
    handler: controller.getSingleApp
  },
  {
    method: 'GET',
    url: '/api/devices/:id',
    handler: controller.getDevices
  },
  {
    method: 'GET',
    url: '/api/devicename/:id',
    handler: controller.getDeviceName
  },
  {
    method: 'GET',
    url: '/api/payloads/:id',
    handler: controller.getPayloadsforDevice
  },
  {
    method: 'GET',
    url: '/api/latestpayloads/:id',
    handler: controller.getLatestPayloads
  },
  {
    method: 'GET',
    url: '/:uid',
    handler: controller.handle404
  },
  {
    method: 'POST',
    url: '/api/users',
    handler: controller.addNewUser
  }

];

module.exports = routes;
