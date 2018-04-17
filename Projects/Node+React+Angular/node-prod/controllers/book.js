const { Book } = require('./../models/book');
const { authenticate } = require('./middleware/authenticate');

let init = (app) => {

    // Get books - ALL - EVERY CLIENT CAN ACCESS: 
    app.get("/api/book", (request, response) => {
        Book.find({})
            .then(res => {
                response.status(200);
                response.send(JSON.stringify({items:res}));
            })
            .catch(() => { response.status(400).send() });
    });

    // Get books - BY BOOK NAME - EVERY CLIENT CAN ACCESS: 
    app.get("/api/book/name/:q", (request, response) => {
        Book.find({ "volumeInfo.title": new RegExp(request.params.q, 'i') })
            .then(res => {
                response.status(200);
                response.send(JSON.stringify({items:res}));
            })
            .catch(() => { response.status(400).send() });
    });

    // Get books - BY BOOK ID - EVERY CLIENT CAN ACCESS: 
    app.get("/api/book/id/:q", (request, response) => {
        Book.findById(request.params.q)
            .then(res => {
                response.status(200);
                response.send(JSON.stringify(res));
            })
            .catch((e) => { response.status(400).send(e) });
    });


    // add book - ONLY CLIENT THAT IS LOGED IN AS A MANAGER CAN ADD A NEW BOOK: 
    app.post("/api/book", authenticate, (request, response) => {
        if (request.token) {
            let book = new Book(request.body);
            book.save()
                .then(() => response.status(200).send(book))
                .catch(() => response.status(400).send());
        }
        else {
            res.status(401).send();
        }
    })
}

module.exports = { init }
