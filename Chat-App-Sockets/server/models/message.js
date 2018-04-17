
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().toLocaleString()
  };
};

var generateLocation = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().toLocaleString()
  };
};

module.exports = { generateMessage, generateLocation };
