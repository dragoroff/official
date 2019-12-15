const parseData = require("./parseData").parseData;
module.exports.friendsDataCollector = async function friendsDataCollector(
  page,
  targetNumber,
  actualNumber
) {
  const domain = "http://localhost:8000";
  const urlLinkedin = "https://www.linkedin.com/";
  const waitingTime = 3000;
  const errorElement = "Can't find";
  let count = 0;
  let height = 0;
  let messageButtonArray;
  let result = true;

  const buttonSelector = value => `//*[text() = "${value}"]`;
  const connButtSelector = `//*[@aria-label = "See all ${actualNumber} connections"]`;
  const messageButtonSelector = '//span[text() = "Message"]/parent::button';
  const titleSelector = '//*[contains(@class, "card__name")]';

  try {
    console.log("inside data collector");
    await page.waitFor(waitingTime);
    const myNetwork = await page.waitForXPath(buttonSelector("My Network"));
    await myNetwork.click();

    await page.waitFor(waitingTime);
    const connButt = await page.waitForXPath(connButtSelector);
    await connButt.click();

    // We entered to page with list of friends. Choose friends that you want to parse
    // First, scroll down to the bottom to select all friends
    await scroll(count);

    for (i = 0; i < targetNumber; i++) {
      await page.waitFor(waitingTime * 2);
      const users = await page.$x(titleSelector);
      if (users[i]) {
        await users[i].click();
        await page.waitFor(waitingTime * 2);
        // Start to parse data
        page = await parseData(page);

        // Go back to list
        await page.goBack({
          timeout: waitingTime * 2,
          waitUntil: "domcontentloaded"
        });
      }
    }

    // Scroll and check
    async function scroll(count) {
      await page.waitForXPath(messageButtonSelector);
      await page
        .waitForFunction(
          height => {
            return window.scrollTo(0, height + 1280);
          },
          { timeout: 1000 },
          height
        )
        .catch(() => console.log("scrolled"));

      height += 1280;
      messageButtonArray = await page.$x(messageButtonSelector);

      console.log("count", count);
      console.log("messageButtonArray", messageButtonArray.length);
      if (count >= messageButtonArray.length) {
        console.log("This is the end of contact list");
      } else {
        console.log("Continue");
        count += 14;
        await scroll(count);
      }
    }
  } catch (err) {
    result = false;
    console.log(err);
  } finally {
    console.log("End of friends data collector");
    return result;
  }
};
