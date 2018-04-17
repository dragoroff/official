const mongoose = require("mongoose");

let bookSchema = new mongoose.Schema({
    volumeInfo: {
        title: { type: String },
        subtitle: { type: String },
        authors: [],
        publisher: { type: String },
        publishedDate: { type: String },
        description: { type: String },
        pageCount: { type: Number },
        imageLinks: {
            smallThumbnail: { type: String },
            thumbnail: { type: String }
        },
        language: { type: String }
    },
    saleInfo: {
        listPrice: {
            amount: { type: Number },
            currencyCode: { type: String }
        }
    }

});

let Book = mongoose.model("Book", bookSchema, "books");

module.exports = {Book}






