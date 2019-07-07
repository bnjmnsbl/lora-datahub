// this file is deprecated

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let ttnAppSchema = new Schema ({
  app: {}
});

module.exports = mongoose.model('ttnApp', ttnAppSchema);
