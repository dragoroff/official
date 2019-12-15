module.exports.addGroup = async function addGroup(browser, page) {
  const waitingTime = 3000;
  let randomFromOneToTen = Math.ceil(Math.random() * 10);
  const titlesSelector = '//h3[contains(@class, "title")]';
  const requestToJoinSelector =
    '//span[text() = "Request to join"]/parent::button';
  const errorElement = "Can't find";
  const withdrawSel = '//*[text() = "Withdraw"]';
  const pendingSelector =
    '//*[text() = "You have reached your request limit. Withdraw pending requests before requesting to join."]';
  const withdrawLinkSel = '//a[text() =  "Manage"]';
  const linkSelector = async (selector, index) =>
    await page
      .waitForFunction(
        args => {
          let results = [];
          const element = document.evaluate(
            args[0],
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
          for (let a = 0, length = element.snapshotLength; a < length; a++) {
            results.push(element.snapshotItem(a));
          }
          return results[args[1]].parentElement.href;
        },
        { timeout: waitingTime * 2 },
        [selector, index]
      )
      .catch(() => console.log("Seeking for link"));

  try {
    await page
      .waitForFunction(
        () => {
          return window.scrollBy(0, window.innerHeight);
        },
        { timeout: waitingTime }
      )
      .catch(() => console.log("scrolled"));

    await page.waitFor(waitingTime);

    const link = await linkSelector(
      titlesSelector,
      randomFromOneToTen - 1
    ).catch(() => console.log(`${errorElement} link`));
    if (link) {
      const url = await page.url();
      const newPage = await browser.newPage();
      await newPage.goto(link._remoteObject.value, {
        waitUntil: "domcontentloaded",
        referer: url
      });

      //Skip advertisement
      await newPage.waitFor(waitingTime);
      await newPage.keyboard.press("Escape");

      const requestToJoin = await newPage
        .waitForXPath(requestToJoinSelector, { timeout: waitingTime })
        .catch(() => console.log(`${errorElement} request to join button`));
      if (requestToJoin) {
        await requestToJoin.click();
        await newPage.waitFor(waitingTime);

        const withdrawPending = await newPage
          .waitForXPath(pendingSelector, { timeout: waitingTime })
          .catch(() => console.log("No need to withdraw pendings"));

        if (withdrawPending) {
          console.log("withdraw");
          const withdrawLink = await newPage.waitForXPath(withdrawLinkSel);
          await withdrawLink.click();

          await newPage.waitFor(waitingTime);
          await newPage.evaluate(() =>
            window.scrollBy(window.innerHeight, 2560)
          );

          const withdraw = await newPage.$x(withdrawSel);
          for (let i in withdraw) {
            await withdraw[i].click();
            await newPage.waitFor(waitingTime / 2);
          }

          await newPage.goBack({
            timeout: waitingTime * 2,
            waitUntil: "domcontentloaded"
          });
        }
        await newPage.goBack({
          timeout: waitingTime * 2,
          waitUntil: "domcontentloaded"
        });
      } else {
        console.log("Go back");
        await newPage.goBack({
          timeout: waitingTime * 3,
          waitUntil: "domcontentloaded"
        });
      }

      await newPage.close();
    } else {
      console.log(`${errorElement} any title`);
      throw Error;
    }
  } catch (err) {
    throw err;
  }
};
