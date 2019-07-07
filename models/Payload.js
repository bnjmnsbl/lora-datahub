const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let PayloadSchema = new Schema ({
  parentDevice: {type: Schema.Types.ObjectId, ref: 'Device'},
  timestamp: {type: String},
  payload: {}
});

module.exports = mongoose.model('Payload', PayloadSchema);
