const mongoose = require("mongoose");

let schemaDefenition=()=>({
        type: String,
        required: true,
        unique: true
    });

let countrySchema = new mongoose.Schema({
    flag: schemaDefenition(),
    name: schemaDefenition(),
});

let Country = mongoose.model("Country", countrySchema, "countries");

module.exports = {
    Country
}


