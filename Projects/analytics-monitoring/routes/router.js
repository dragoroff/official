const handler = require('../controllers/apiHandler');

module.exports = function (app) {
    app.get('/get-site-stats', (req, res) => handler.handleSingleSiteRequest(req, res));
    app.get('/get-all-stats', (req, res) => handler.handleAllSitesRequest(req, res));
    app.get('/campaigns', (req, res) => handler.handleGetCampaigns(req, res));
    app.post('/add-campaign', (req, res) => handler.handleAddCampaign(req, res));
    app.post('/remove-campaign', (req, res) => handler.handleRemoveCampaign(req, res));
};

