const {google} = require('googleapis');
const params = require('../config/config');
const creds = require('../creds/creds');

module.exports = {
    Authorize: async function () {
        const jwt = new google.auth.JWT(creds.client_email, null, creds.private_key
            .replace(/\\n/g, '\n'), params.params.scopes, null);

        const err = await jwt.authorize().catch(err => err);
        if (err.response) {
            return [null, err.response.data.error_description];
        }

        return [jwt, null];
    }
};
