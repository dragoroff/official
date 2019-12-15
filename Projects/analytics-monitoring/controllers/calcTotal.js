module.exports = {
    Sum: function (data) {
        let final_data = {};
        for (let i in data[0]) {
            {
                if (['ga:users', 'ga:newUsers', 'ga:sessions', 'ga:pageviews'].indexOf(i) >= 0) {
                    let total = data.reduce((prev, curr) => {
                        return {
                            [i]: (parseFloat(prev[i]) + parseFloat(curr[i])).toString()
                        }
                    });
                    final_data[Object.keys(total)] = total[Object.keys(total)];
                }
                if (['ga:sessionsPerUser'].indexOf(i) >= 0){
                    final_data['ga:sessionsPerUser'] = (final_data['ga:sessions'] / final_data['ga:users']).toString();
                }
                if (['ga:pageviewsPerSession'].indexOf(i) >= 0){
                    final_data['ga:pageviewsPerSession'] = (final_data['ga:pageviews'] / final_data['ga:sessions']).toString();
                }
                if (['ga:avgSessionDuration', 'ga:bounceRate'].indexOf(i) >= 0) {
                    const non_zero = [];
                    let total = data.reduce((prev, curr, x) => {
                        let parsed_pre = parseFloat(prev[i]);
                        let parsed_cur = parseFloat(curr[i]);
                        if (x === 1) {
                            if (parsed_pre !== 0) {
                                non_zero.push(parsed_pre);
                            }
                        }

                        if (parsed_cur !== 0) {
                            non_zero.push(parsed_cur);
                        }

                        return {
                            [i]: (parsed_pre + parsed_cur).toString()
                        }
                    });
                    final_data[Object.keys(total)] = (total[Object.keys(total)] / non_zero.length).toString();
                }
                if (['From', 'To', 'CampaignID', 'Hostname'].indexOf(i) >= 0) {
                    final_data[i] = "";
                }
            }
        }
        return final_data;
    }
};