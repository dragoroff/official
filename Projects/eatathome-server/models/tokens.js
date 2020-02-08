const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Number,
    required: true
  }
});

module.exports = Token = mongoose.model("token", TokenSchema);
