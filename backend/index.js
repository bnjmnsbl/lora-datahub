// Require environment variables
require('dotenv').config({path:__dirname+'/./../.env'});
let fetchScript = require(__dirname+'/./../fetch_script/fetch_async.js');

//Import Swagger Options
const swagger = require('./config/swagger');

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
});

fastify.register(require('fastify-jwt'), {
  secret: 'supersecret'
});

// Regist CORS
fastify.register(require('fastify-cors'), {});
// Register Swagger
fastify.register(require('fastify-swagger'), swagger.options);

const routes = require('./routes');

routes.forEach((route) => {
  fastify.route(route);
});

// eslint-disable-next-line no-unused-vars
const db = require('../fetch_script/db');

//Run fetch script from here
fetchScript.init();

// Run the server!
const start = async () => {

  // changed adress to work with uberspace!
  try {
    fastify.listen(3000, '0.0.0.0', function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.swagger();
      fastify.log.info(`server listening on ${address}`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
