// Require environment variables
require('dotenv').config({path:__dirname+'/./../.env'});

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

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.swagger();
    fastify.log.info(`listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
