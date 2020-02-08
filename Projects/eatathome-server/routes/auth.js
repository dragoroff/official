const authHandler = require("../controllers/auth");

const routes = app => {
  app.post("/auth/google/signup", authHandler.signUpGoogle);
};

module.exports = { routes };
