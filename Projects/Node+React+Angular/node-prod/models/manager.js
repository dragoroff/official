const mongoose = require("mongoose");

let schemaDefenition=(min,max,pk=false)=>({
        type: String,
        required: true,
        unique: pk,
        minlength: min,
        maxlength:max
    });
let managerSchema = new mongoose.Schema({
    firstName: schemaDefenition(3,10),
    lastName: schemaDefenition(3,10),
    username:schemaDefenition(3,10,true),
    password: schemaDefenition(64,64)
});

let Manager = mongoose.model("Manager", managerSchema, "managers");
module.exports = {
    Manager
}


