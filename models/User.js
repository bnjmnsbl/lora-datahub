const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let UserSchema = new Schema ({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},

});

module.exports = mongoose.model('User', UserSchema);
