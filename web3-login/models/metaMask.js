const MetaAuth = require("meta-auth");

const metaAuth = new MetaAuth({
  message: "msg",
  signature: "sig",
  address: "address",
});

module.exports = metaAuth
