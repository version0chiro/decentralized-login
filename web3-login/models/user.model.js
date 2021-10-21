const moongose = require("mongoose");

var Schema = moongose.Schema;

var User = new Schema({
  nonce: {
    type: Number,
    required: true,
    default: () => {
      Math.floor(Math.random() * 100000);
    },
    unique: true,
  },
  publicAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

module.exports = moongose.model("User", User);
