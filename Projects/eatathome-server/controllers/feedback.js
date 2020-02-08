const Validator = require("validator");
const apiResponse = require("../helpers/apiResponse").apiResponse;
const Host = require("../models/host");
const Customer = require("../models/customer");

const addContact = (req, res) => {
  let { firstName, lastName, email, phone, country, obj } = req.body;

  console.log(firstName, lastName, email, phone, country, obj);

  if (!obj) {
    return apiResponse(res, 500, "Missing object argument");
  }
  if (!firstName || !lastName || !email || !phone || !country) {
    return apiResponse(res, 400, "All fields are required");
  }

  if (!Validator.isEmail(email)) {
    return apiResponse(res, 400, "Email is incorrect");
  }

  if (typeof phone !== "string") {
    phone = phone.toString();
  }

  if (obj === "customer") {
    Customer.findOne({ email }).then(exist => {
      if (exist) {
        return apiResponse(res, 409, "Email is already in use");
      }

      const customer = new Customer({
        firstName,
        lastName,
        email,
        phone,
        country
      });

      return customer
        .save()
        .then(() => apiResponse(res, 200, "success"))
        .catch(err => console.log(`Error writting in DB: ${err}`));
    });
  } else if (obj === "host") {
    Host.findOne({ email }).then(exist => {
      if (exist) {
        return apiResponse(res, 409, "Email is already in use");
      }

      const host = new Host({
        firstName,
        lastName,
        email,
        phone,
        country
      });

      console.log("HOST", host);

      return host
        .save()
        .then(() => apiResponse(res, 200, "success"))
        .catch(err => console.log(`Error writting in DB: ${err}`));
    });
  } else {
    return apiResponse(res, 500, "Obj argument is not correct");
  }
};

module.exports = {
  addContact
};
