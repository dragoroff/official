const validate = require('../utils/validator');
const prepareReport = require('../controllers/prepareReport');
const config = require('../config/config');
const sumTotal = require('../controllers/calcTotal');
const sendResponse = require('../controllers/sendResponse');
const batchDelay = 20;


module.exports = {
    handleSingleSiteRequest: async function (req, res) {
        let id = req.query.id;
        let start = req.query.start;
        let end = req.query.end;
        let format = req.query.format;

        if (!id || !start || !end || !format) {
            return res.status(400).send({
                "bad request": "request is invalid, not enough parameters",
            })
        }

        let [result, err] = validate(id, start, end, format);

        // get domain and put it to result array
        let index = config.params.campaignIds.indexOf(id);
        result.splice(1, 0, config.params.campaignDomains[index]);

        if (err !== null) {
            return res.status(400).send(
                {
                    "bad request": "request is invalid",
                    "log": JSON.stringify(err)
                });
        }

        let [fields, data, error] = await prepareReport.singleSiteReport(result);
        if (error !== null) {
            return res.status(400).send({"Error": error});
        }

        format = result[4];
        sendResponse.Send(format, fields, [data], res);
    },
    handleAllSitesRequest: async function (req, res) {
        // don't do retries. Nodejs bug. Wait 10 minutes
        req.connection.setTimeout(600000,  () => res.status(500).end());

        let start = req.query.start;
        let end = req.query.end;
        let format = req.query.format;

        if (!start || !end || !format) {
            return res.status(400).send({
                "bad request": "request is invalid, not enough parameters",
            })
        }

        let [result, err] = validate(start, end, format);

        if (err !== null) {
            return res.status(400).send(
                {
                    "bad request": "request is invalid",
                    "log": JSON.stringify(err)
                });
        }

        let final_fields, final_data = [];
        for (let [i, id] of config.params.campaignIds.entries()) {
            console.log("INDEX", i);
            console.log("ID", id);
            if (i % batchDelay === 0) {
                await setTimeout(() => console.log("TIMEOUT"), 3000);
            }
            result.unshift(id, config.params.campaignDomains[i]);

            let [fields, data, error] = await prepareReport.singleSiteReport(result);
            if (error !== null) {
                console.log({"Error": error});
                // return res.status(400).send({"Error": error});
                continue;
            }

            final_fields = fields;
            final_data.push(data);
            result = result.slice(2);
        }

        // Sum every parameter up
        const total = sumTotal.Sum(final_data);
        final_data.push(total);

        format = result[2];
        sendResponse.Send(format, final_fields, final_data, res);
    },
    handleGetCampaigns: function (req, res) {
        const ids = config.params.campaignIds;
        const domains = config.params.campaignDomains;
        if (!ids || !domains) {
            return res.render('campaigns', {"error": "There is no campaign in the list"});
        }
        return res.render('campaigns', {ids: ids, domains: domains});
    },
    handleAddCampaign: function (req, res) {
        const campaign_ids = req.body.campaign;
        const domains = req.body.domain;
        const cur_ids = config.params.campaignIds;
        const cur_domains = config.params.campaignDomains;
        if (!campaign_ids) {
            return res.render('campaigns', {
                "error": "At least one campaign id is required",
                ids: cur_ids,
                domains: cur_domains
            });
        }
        if (typeof campaign_ids === 'string') {
            if (cur_ids.includes(campaign_ids)) {
                return res.render('campaigns', {
                    "error": `Campaign ${campaign_ids} is already exists`,
                    ids: cur_ids,
                    domains: cur_domains
                });
            }
            cur_ids.push(campaign_ids);
            cur_domains.push(domains);
        } else {
            // check that ids haven't already existed in list
            if (campaign_ids.some(x => cur_ids.includes(x))) {
                return res.render('campaigns', {
                    "error": `One of campaign is already exists`,
                    ids: cur_ids,
                    domains: cur_domains
                });
            }
            cur_ids.concat(campaign_ids);
            cur_domains.concat(domains);
        }

        return res.render('campaigns', {
            "Status": "Campaign successfully have been added",
            "ID": campaign_ids,
            ids: cur_ids,
            domains: cur_domains
        });
    },
    handleRemoveCampaign: function (req, res) {
        const campaign_ids = req.body.campaign;
        const existing_ids = config.params.campaignIds;
        const existing_domains = config.params.campaignDomains;
        if (!campaign_ids) {
            return res.render('campaigns', {
                "error": "At least one campaign id is required",
                ids: existing_ids,
                domains: existing_domains,
            });
        }

        if (typeof campaign_ids === 'string') {
            let index = existing_ids.indexOf(campaign_ids);
            if (index > -1) {
                existing_ids.splice(index, 1);
                existing_domains.splice(index, 1);
            } else {
                return res.render('campaigns', {
                    "error": `Can't find ${campaign_ids} in the list of campaigns`,
                    ids: existing_ids,
                    domains: existing_domains,
                })
            }
        } else {
            for (let id of campaign_ids) {
                let index = existing_ids.indexOf(id);
                if (index > -1) {
                    existing_ids.splice(index, 1);
                    existing_domains.splice(index, 1);
                } else {
                    return res.render(
                        'campaigns', {
                            "error": `Can't find ${id} in the list of campaigns`,
                            ids: existing_ids,
                            domains: existing_domains,
                        })
                }
            }
        }

        return res.render('campaigns', {
            "Status": "Campaign successfully have been removed",
            "ID": campaign_ids,
            ids: existing_ids,
            domains: existing_domains,
        });
    }
};