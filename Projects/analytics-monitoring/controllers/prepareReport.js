const {google} = require('googleapis');
const params = require('../config/config');

module.exports = {
    singleSiteReport: async function (data) {
        const authorization = require('./auth').Authorize,
            [ID, domain, start_date, end_date] = data,
            analytics = google.analyticsreporting(params.params.apiVersion),
            date_filters = {
                startDate: start_date,
                endDate: end_date,
            };


        const [jwt, err] = await authorization();
        if (err) {
            return [null, null, err];
        }

        const req = {
            reportRequests: [{
                viewId: ID,
                dateRanges: date_filters,
                metrics: params.params.metrics
            }],
        };


        const resp = await analytics.reports.batchGet({
            auth: jwt,
            resource: req
        }).then(res => res).catch(err => {
            console.log('Failed to get Report');
            return err;
        });

        if (resp.errors) {
            return [null, null, `${resp.errors[0].message}: ${ID}`];
        }

        // get metrics data
        const r = req.reportRequests[0],
            res = resp.data.reports[0],
            start = r.dateRanges.startDate,
            end = r.dateRanges.endDate,
            id = r.viewId,
            fields = ['From', 'To', 'CampaignID', 'Hostname'];

        const final_data = {
            "From": start,
            "To": end,
            "CampaignID": id,
            "Hostname": domain,
        };

        // prepare data for model
        for (let m = 0; m < r.metrics.length; m++) {
            let metric_name = res.columnHeader.metricHeader.metricHeaderEntries[m].name;

            fields.push(metric_name);
            final_data[metric_name] = Math.round(parseFloat(res.data.totals[0].values[m]) * 100) / 100;
        }

        return [fields, final_data, null];
    }
};


