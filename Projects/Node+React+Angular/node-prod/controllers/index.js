// Requires:
const express = require("express"); 
const bodyParser = require("body-parser"); 
const path=require('path');

const managerController = require('./manager');
const bookController=require('./book');
const countryController=require('./country');
const clientController=require('./client');

const viewBasicPath=path.join(__dirname+"/../views");

// Create express app:
const app = express();

// Use middlewares:
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(viewBasicPath+'/react_view'));  //react folder
app.use(express.static(viewBasicPath+'/angular_view'));   //angular folder


app.get("/managmentSystem",(req,res)=>{   //react routing
    console.log("user request");
    res.sendFile(viewBasicPath+ "/react_view/index.html");
});

app.get("/bookStore",(req,res)=>{   //angular routing
    res.sendFile(viewBasicPath + "/angular_view/index.html");
});

managerController.init(app);
bookController.init(app);
countryController.init(app);
clientController.init(app);

module.exports={app};