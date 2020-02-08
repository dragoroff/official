// const { getNewToken, authorizeGoogle } = require("../oauth/gmail/");
const { apiResponse } = require("../helpers/apiResponse");
const Host = require("../models/host");

const signUpGoogle = async (req, res) => {
  const data = req.body.data;
  if (!data) {
    return apiResponse(res, 500, "Missing object argument");
  }

  const email = data.email ? data.email : "";
  if (!email) {
    return apiResponse(res, 500, "Email is required. Try another method");
  }

  // create refresh token

  const name = data.givenName ? data.givenName : "";
  const lastName = data.familyName ? data.familyName : "";
  const image = data.imageUrl ? data.imageUrl : "";
  const googleId = data.googleId ? data.googleId : "";

  const newRecord = {
    firstName: name,
    lastName: lastName,
    email: email,
    imageUrl: image,
    googleId: googleId
  };
  //
  // if user not exist --> create
  // if user exist --> record is empty --> update
  // if user exist --> record is not empty --> do nothing
  //
  const host = await Host.findOneAndUpdate(
    { email: email },
    newRecord,
    { new: true, upsert: true, setDefaultsOnInsert: true },
    err => {
      // shouldn't happen
      if (err) {
        throw new Error(`Error in writing to DB: ${err}`);
      }
    }
  );

  return apiResponse(res, 200, { user: host });
};

module.exports = {
  signUpGoogle
};
