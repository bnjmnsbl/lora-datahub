const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let DeviceSchema = new Schema ({
  parentApp: {type: Schema.Types.ObjectId, ref: 'App'},
  devId: {type: String, required: true},
  hardwareSerial: {type: String},
  location: [Number],
  payloads: [{type: Schema.Types.ObjectId, ref: 'Payload'}]
});

module.exports = mongoose.model('Device', DeviceSchema);
