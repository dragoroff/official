const {Parser} = require('json2csv');

module.exports = {
    Create: function(fields, data){
        try {
            const json2csvParser = new Parser({fields});
            return [json2csvParser.parse(data), null];
        } catch (e) {
            return [null, e];
        }
    }
}