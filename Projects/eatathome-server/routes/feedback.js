const feedbackHandler = require("../controllers/feedback");

const routes = app => {
  app.post("/api/landing/add-person/", feedbackHandler.addContact);
};

module.exports = { routes };
