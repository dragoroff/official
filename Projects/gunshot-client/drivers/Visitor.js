const puppeteer = require("puppeteer");
const axios = require("axios");
const domain = require("../helpers/domain").domain;

module.exports.visit = async function (job) {
    const job_id = job.id,
        url_list = job.data['url_list'],
        serp_index = parseInt(job.data['serp_index']),
        target_url = job.data['target_url'],
        element_text = job.data['element_text'],
        keyword_list = job.data['keyword_list'],
        proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;

    let time_delay = parseInt(job.data['time_delay']) * 1000;

    const timeout = 30000;
    const waitingTime = 6000;
    const polling = 4000;
    const delayNum = () => {
        return Math.ceil(Math.random() * 100 + 100);
    };

    const googleInputSel = '//input[@title]';
    const serpElementSel = '//h3[@class = "LC20lb"]';
    const elementSel = value => `//*[contains(text(), "${value}")]`;

    const scrollDown = async page => {
        const radnTimeout = (Math.random() * 5 + 1) * 2000;
        await page
            .waitForFunction(
                () => {
                    return window.scrollBy(0, window.innerHeight);
                },
                {polling: polling, timeout: radnTimeout}
            )
            .catch(() => console.log("scrolled"));
    };

    const scrollUp = async page => {
        await page
            .waitForFunction(
                () => {
                    return window.scrollBy({behavior: 'smooth', top: -window.innerHeight});
                },
                {polling: polling, timeout: polling}
            )
            .catch(() => console.log("scrolled"));
    };

    try {
        await axios
            .post(`${domain}/api/visitor/${job_id}/status/`, JSON.stringify({status: "STARTED"}))
            .then(() => console.log("Success"))
            .catch(() => console.log("Failed"));


        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1280,
                height: 800
            },
            args: [
                `--proxy-server=${proxy}`,
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu"
            ]
        });
        const page = await browser.newPage();
        await page.deleteCookie();

        if (url_list) {
            for (let url of url_list) {
                await page.goto(url, {waitUntil: "domcontentloaded", timeout});
                await page.waitFor(waitingTime);

                await scrollDown(page);
                await scrollUp(page);

                await page.waitFor(waitingTime);
            }
        }

        if (keyword_list) {
            for (let keyword of keyword_list) {
                await page.goto('https://www.google.com/', {waitUntil: "domcontentloaded", timeout});
                await page.waitFor(waitingTime);

                const googleInput = await page.waitForXPath(googleInputSel, {timeout: waitingTime})
                    .catch(() => console.log("No google input"));

                if (googleInput) {
                    await googleInput.click();
                    await googleInput.type(keyword, {delay: delayNum()});
                    await page.keyboard.press("Enter");
                    await page.waitFor(waitingTime);

                    const serpElement = await page.$x(serpElementSel)
                        .catch(() => console.log("No SERP Element"));

                    console.log("LEN", serpElement.length);
                    if (serpElement) {
                        if (serp_index && serpElement[serp_index]) {
                            await serpElement[serp_index].click();
                            await page.waitFor(waitingTime);
                        } else {
                            await serpElement[0].click();
                            await page.waitFor(waitingTime);
                        }

                        await scrollDown(page);
                        await scrollUp(page);
                        await page.waitFor(waitingTime);
                    }
                }
            }
        }

        if (target_url) {
            await page.goto(target_url, {waitUntil: "domcontentloaded", timeout});
            const targetElement = await page.waitForXPath(elementSel(element_text))
                .catch(() => console.log("No Target element found"));

            if (targetElement) {
                await targetElement.click();
                await page.waitFor(waitingTime);
            }

            await scrollDown(page);
        }

        await page.waitFor(time_delay);

        await axios
            .post(`${domain}/api/visitor/${job_id}/status/`, JSON.stringify({status: "ENDED"}))
            .then(() => console.log("Success"))
            .catch(() => console.log("Failed"));
        await axios
            .post(`${domain}/api/core/common/job/${job_id}/end/`)
            .then(() => console.log("Success"))
            .catch(() => console.log("Failed"));

        await browser.close();
    } catch (err) {
        throw err;
    }
};
