const axios = require("axios");
const passwordChange = require("./drivers/PasswordChanger").passwordChange;
const profileCrawler = require("./drivers/ProfileCrawler").parser;
const Builder = require("./drivers/Builder").signUp;
const Filler = require("./drivers/Filler").progressProfile;
const Searcher = require("./drivers/Searcher").addingFriends;
const CampaignCrawler = require("./drivers/CampaignCrawler").parser;
const PeopleDigger = require("./drivers/PeopleDigger").parser;
const CompanyDigger = require("./drivers/CompanyDigger").parser;
// const CampaignMessager = require("./drivers/CampaignMessager").sendMessage;
const Voter = require("./drivers/Voter").voter;
const Visitor = require("./drivers/Visitor").visit;

async function main() {
    // 0: node
    // 1: main.js
    // 2: arg1
    // 3: arg2
    // etc...

    const domain = "http://gunshot.phanatic.io";
    var args = process.argv.slice(),
        opts = {};

    try {
        args = args.slice(2, args.length);
    } catch (err) {
    }

    if (!args.length) {
        console.error("usage: node main --job <jobID>");
        return;
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (!arg) continue;

        arg = arg.toLowerCase();
        var arg2 = args[i + 1] || null;

        if (arg == "--job") {
            if (arg2) {
                opts.job_id = arg2;
            } else {
                console.error("usage: --job <jobID>");
                return;
            }
        }
    }

    if (opts.job_id) {
        const job = await axios
            .get(`${domain}/api/core/common/job/${opts.job_id}/`)
            .then(res => res.data.data.job)
            .catch(err => console.log(err));

        console.log("Type", job.job_type);

        await axios
            .post(`${domain}/api/core/common/job/${job.id}/start/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));

        switch (job.job_type) {
            case "PWD": {
                console.log("Password Changer");
                return passwordChange(job);
            }
            case "PC": {
                console.log("Profile Crawler");
                return profileCrawler(job);
            }
            case "B": {
                console.log("Builder");
                return Builder(job);
            }
            case "F": {
                console.log("Filler");
                return Filler(job);
            }
            case "S": {
                console.log("Searcher");
                return Searcher(job);
            }
            case "CCM":
            case "CCW": {
                console.log("Campaign Crawler");
                if (job.campaign_id) {
                    return CampaignCrawler(job);
                } else if (job.campaign_people_id) {
                    return PeopleDigger(job);
                } else if (job.campaign_company_id) {
                    return CompanyDigger(job);
                } else {
                    console.log("Campaign crawler didn't match any type");
                    break;
                }
            }
            // case "CM": {
            //     console.log("Campaign Messeger");
            //     return CampaignMessager(job);
            // }
            case "V": {
                console.log("Voter");
                return Voter(job);
            }
            case "VIS": {
                console.log("Visitor");
                return Visitor(job);
            }
            default: {
                console.error("Error");
                break;
            }
        }
    } else {
        console.log("nothing to do...");
    }
}

if (require.main === module) {
    main();
}
