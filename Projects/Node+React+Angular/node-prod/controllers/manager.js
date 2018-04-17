const jwt = require('jsonwebtoken');
const { Manager } = require('./../models/manager');

let init = (app) => {
    // Add manager - REGISTER: 
    app.post("/api/manager", (request, response) => {
        let manager = new Manager(request.body);

        manager.save()
            .then((newDoc) => {
                response.status(201).send(newDoc);
            })
            .catch((e) => {
                response.status(400).send(e);
            });
    });

    // Get manager -LOGIN: 
    app.get("/api/manager",  (request, response) =>{
        var shaSecret = request.header('xx-auth');
        if (shaSecret) {
            return Manager.findOne({
                "password": shaSecret.substring(0, 64),
                "username": shaSecret.substring(64, shaSecret.length)
            }).then((m) => {
                var data = {
                    id: m._id
                };
                response.header('xx-auth', jwt.sign(data, 'my secret'));
                response.status(200).send("login success");
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

module.exports = {init}
