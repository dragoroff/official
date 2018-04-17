const { Book } = require('./../book');
const { Country } = require('./../country');

const bookArray = require('./books.json');
const countryArray = require('./countries.json');

const seedMongoDb = async () => {
    let bookCounter = await Book.count({});
    if (!bookCounter)
        Book.insertMany(bookArray);
        Book.remove({});
    let countryCounter = await Country.count({});
    if (!countryCounter)
        Country.insertMany(countryArray);
}

module.exports={seedMongoDb};