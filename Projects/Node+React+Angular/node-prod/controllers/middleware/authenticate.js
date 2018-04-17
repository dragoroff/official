const jwt = require('jsonwebtoken');
const { Manager } = require('./../../models/manager');

var authenticate = (req, res, next) => {
  var token = req.header('xx-auth');
  let decoded = jwt.verify(token, 'my secret');
 
  return Manager.findOne({
    '_id': decoded._id
  }).then((manager)=>{
    req.manager = manager;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
