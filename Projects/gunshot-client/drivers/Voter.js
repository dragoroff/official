const puppeteer = require("puppeteer");
const axios = require("axios");
const domain = require("../helpers/domain").domain;

module.exports.voter = async function voter(job) {
  const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
  const url = "https://usacbdexpo.com/voting-best-cbd-vape/";
  const votingObjectSelector = '//*[contains(text(), "PhenoPen")]';
  const voteButtonSelector = '//*[@value="Vote"]';
  const closeAdSelector = '//*[@title="close"]';
  const successfulSelector = '//*[text() = "Vote Recorded"]';

  const timeout = 30000;
  const shortWaitingTime = 3000;
  const waitingTime = () => {
    return Math.ceil(Math.random() * 4000 + 8000);
  };

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

  await page.goto(url, { waitUntil: "domcontentloaded", timeout });

  await page.waitFor(waitingTime());
  const closeAd = await page
    .waitForXPath(closeAdSelector, {
      timeout: shortWaitingTime * 3
    })
    .catch(() => console.log("No Ad proposed"));
  if (closeAd) {
    await closeAd.click();
  }
  await page.waitFor(waitingTime());

  const votingObject = await page.waitForXPath(votingObjectSelector);
  await votingObject.click();
  await page.waitFor(waitingTime());

  await page.waitFor(shortWaitingTime);

  const voteButton = await page.waitForXPath(voteButtonSelector);
  await voteButton.click();
  await page.waitFor(waitingTime());

  const successful = await page
    .waitForXPath(successfulSelector, { timeout: shortWaitingTime })
    .catch(() => console.log("can't find succesfull result"));

  if (successful) {
    await browser.close();
    await axios
      .post(`${domain}/api/core/common/job/${job.id}/end/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  } else {
    await browser.close();
    await voter(job);
  }
};
