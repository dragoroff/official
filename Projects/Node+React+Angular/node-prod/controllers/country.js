const { Country } = require('./../models/country');

let init = (app) => {   
    // Get countries - ALL: 
    app.get("/api/country", (request, response) => {
        Country.find({})
            .then(res => response.status(200).send(JSON.stringify(res)))
            .catch(()=>response.status(400).send());
    });
}

module.exports = { init }
