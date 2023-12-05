const controller = require("../controllers/contact.controller");

module.exports = function (app) {
  app.post("/contact",controller.submitForm);
};

