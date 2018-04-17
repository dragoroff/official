const mongoose = require("mongoose");
const {seedMongoDb}=require('./seeders/seeder');

// Connect to MongoDB: 
mongoose.connect("mongodb://localhost:27017/bookStore", (err)=> {
    console.log("We're connected to MongoDB.");
    seedMongoDb();
});

module.exports={
    mongoose
}
