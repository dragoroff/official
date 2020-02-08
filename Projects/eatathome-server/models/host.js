const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HostSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  country: {
    type: String
  },
  imageUrl: {
    type: String
  },
  birth: {
    type: String
  },
  googleID: {
    type: String
  },
  facebookID: {
    type: String
  },
  token: {
    type: Schema.ObjectId,
    ref: "token"
  }
});

module.exports = Host = mongoose.model("hosts", HostSchema);
