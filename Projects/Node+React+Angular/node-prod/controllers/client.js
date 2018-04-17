const jwt = require('jsonwebtoken');
const { Client } = require('./../models/client');

let init = (app) => {
    // Add client - REGISTER: 
    app.post("/api/client", (request, response) => {
        let client = new Client(request.body);

        client.save()
            .then((newDoc) => {
                var data = {
                    id: newDoc._id
                };
                response.header('xx-auth', jwt.sign(data, 'my secret'));
                response.status(201).send(newDoc);
            })
            .catch((e) => {
                response.status(400).send(e);
            });
    });

    // Get client -LOGIN: 
    app.get("/api/client", (request, response) => {
        var shaSecret = request.header('xx-auth');
        if (shaSecret) {
            return Client.findOne({
                "password": shaSecret.substring(0, 64),
                "userName": shaSecret.substring(64, shaSecret.length)
            }).then((m) => {
                var data = {
                    id: m._id
                };
                response.header('xx-auth', jwt.sign(data, 'my secret'));
                response.status(200)
                .send(JSON.stringify({"status":"login success"}));
            })
                .catch((e) => {
                    response.status(401).send();
                });
        }
        else {
            response.status(401).send();
        }
    });
}

module.exports = { init }
