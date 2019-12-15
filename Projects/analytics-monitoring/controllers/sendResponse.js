const createCsv = require('./createCSV');
// const path = require('path');

module.exports = {
    Send: function (format, fields, data, res) {
        switch (format) {
            case "csv": {
                const [result, error] = createCsv.Create(fields, data);
                if (error != null) {
                    return res.status(400).send({"Error": error});
                }

                res.attachment('monitoring.csv');
                return res.status(200).send(result)
            }
            case "json": {
                return res.status(200).send(JSON.stringify(data))
            }
            case "html": {
                return res.render('stats', {fields: fields, data: data})
            }
            default: {
                return res.status(400).send({"Error": "Format is incorrect"})
            }
        }
    }
};