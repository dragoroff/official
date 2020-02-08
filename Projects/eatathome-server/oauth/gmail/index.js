const { google } = require("googleapis");
const OAuth2Data = require("./credentials.json");
const axios = require("axios");

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

function authorizeGoogle() {
  // const oAuth2Client = new google.auth.OAuth2(
  //   CLIENT_ID,
  //   CLIENT_SECRET,
  //   REDIRECT_URL
  // );
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  });

  return url;
}

async function getNewToken(code) {
  // const oAuth2Client = new google.auth.OAuth2(
  //   CLIENT_ID,
  //   CLIENT_SECRET,
  //   REDIRECT_URL
  // );

  // Get an access token based on our OAuth code
  // const tokens = await oAuth2Client
  //   .getToken(code)
  //   .then(tokens => {
  //     oAuth2Client.setCredentials(tokens);
  //     return tokens;
  //   })
  //   .catch(err => err);
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  console.log("TOJKENS", tokens);
  return tokens;
}

module.exports = {
  authorizeGoogle,
  getNewToken
};

// const express = require("express");
// const app = express();
// const authed = false;
// const cors = require("cors");

// app.use(cors());
// app.get("/auth", (req, res) => {
//   if (!authed) {
//     // const oAuth2Client = new google.auth.OAuth2(
//     //   CLIENT_ID,
//     //   CLIENT_SECRET,
//     //   REDIRECT_URL
//     // );
//     // Generate an OAuth URL and redirect there
//     const url = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: [
//         "https://www.googleapis.com/auth/userinfo.profile",
//         "https://www.googleapis.com/auth/userinfo.email"
//       ]
//     });
//     console.log(url);
//     res.redirect(url);
//   } else {
//     console.log("AUTH");
//     const service = google.people({ version: "v1", auth: oAuth2Client });
//     service.people.connections.list(
//       {
//         resourceName: "people/me",
//         pageSize: 10,
//         personFields: "names,emailAddresses"
//       },
//       (err, res) => {
//         if (err) return console.error("The API returned an error: " + err);
//         const connections = res.data.connections;
//         if (connections) {
//           console.log("Connections:");
//           connections.forEach(person => {
//             if (person.names && person.names.length > 0) {
//               console.log(person.names[0].displayName);
//             } else {
//               console.log("No display name found for connection.");
//             }
//           });
//         } else {
//           console.log("No connections found.");
//         }
//       }
//     );
//   }
// });

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URL
// );
// app.get("/auth/google/callback", function(req, res) {
//   const code = req.query.code;
//   if (code) {
//     // Get an access token based on our OAuth code
//     oAuth2Client.getToken(code, async function(err, tokens) {
//       if (err) {
//         console.log("Error authenticating");
//         console.log(err);
//       } else {
//         console.log("Successfully authenticated");
//         console.log("[TOKEN]:", tokens);
//         oAuth2Client.setCredentials(tokens);
//         console.log("11111111111111111");
//         const data = await axios
//           .get(
//             `https://oauth2.googleapis.com/tokeninfo?id_token=${tokens.id_token}`
//           )
//           .catch(err => {
//             throw new Error(err);
//           });
//         console.log(data.data);
//         res.redirect("/");
//       }
//     });
//   }
// });

// const port = 8000;
// app.listen(port, () => console.log("Server is running"));
