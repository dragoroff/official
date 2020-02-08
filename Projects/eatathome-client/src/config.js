if (process.env.NODE_ENV === "production") {
  module.exports.serverPath = "http://www.eat-athome.com";
} else {
  module.exports.serverPath = "http://localhost:8000";
}
