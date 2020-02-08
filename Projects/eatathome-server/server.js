const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

const feedRoutes = require("./routes/feedback");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use(cors());

const db = require("./config/keys").MongoURI;

console.log(db);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(`[Error DB]: ${err}`));

// Routes
feedRoutes.routes(app);
authRoutes.routes(app);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("public"));

  console.log("Inside");
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });
}

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Listening on ${port} port`));
