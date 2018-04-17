const mongoose = require("mongoose");

let schemaDefenition = (min, max, pk = false, requier = true) => ({
    type: String,
    required: requier,
    unique: pk,
    minlength: min,
    maxlength: max
});

let clientSchema = new mongoose.Schema(
    {
        firstName: schemaDefenition(3, 15),
        lastName: schemaDefenition(3, 15),
        userName: schemaDefenition(3, 15, true),
        password: schemaDefenition(64, 64),
        country: schemaDefenition(2, 30, false, false)
    }
);

let Client = mongoose.model("Client", clientSchema, "clients");

module.exports = {
    Client
}


