const { username, password } = require("../dbCreds");

module.exports = {
  MongoURI: `mongodb://${username}:${password}@ds141232.mlab.com:41232/eatathome`
};
