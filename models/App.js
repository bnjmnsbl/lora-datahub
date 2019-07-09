const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let AppSchema = new Schema ({
  appId: {type: String, required: true},
  uniqueId: {type: String, required: true},
  description: {type: String},
  locationName: {type: String},
  user: {type: String}
});

module.exports = mongoose.model('App', AppSchema);
