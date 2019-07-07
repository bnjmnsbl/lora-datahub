const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let AppSchema = new Schema ({
  appId: {type: String, required: true},
  uniqueId: {type: String, required: true},
  description: {type: String},
  locationName: {type: String},
  devices: [{type: Schema.Types.ObjectId, ref: 'Payload'}]
});

module.exports = mongoose.model('App', AppSchema);
