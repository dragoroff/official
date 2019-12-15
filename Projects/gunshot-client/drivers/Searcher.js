const extLoginFunc = require("../helpers/SignIn");
const changePage = require("../helpers/changePage").changePage;
const axios = require("axios");
const verificateEmail = require("../helpers/verification").verificateEmail;
const dataCollector = require("../helpers/dataCollector").friendsDataCollector;
const domain = require("../helpers/domain").domain;

module.exports.addingFriends = async function addingFriends(job) {
  let count = 1;
  let page, browser;
  let noCityStatus = false;

  let delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
  };

  let randomRefreshOneToFive = () => {
    return Math.ceil(Math.random() * 5);
  };

  const waitingTime = 3000;
  const shortWaitingTime = 1000;

  const errorElement = "Can't find";

  const searchBoxSelector = '//input[contains(@aria-label, "Search")]';
  const submitClassSelector = '//button[contains(@class, "button-primary")]';
  const clearSelector = '//span[contains(text(), "Clear")]';
  const locInputSelector = '//input[@placeholder = "Add a country/region"]';
  const applyBtnSelector =
    '//button[contains(@class, "search-advanced-facets__button--apply")]';
  const clearButtonSelector = '//*[text() = "Clear "]//span';
  const dismissSelector = '//*[text() = "Dismiss"]/parent::button';
  const dismissInfoboxSelector = '//*[@aria-label = "Dismiss"]';
  const connectionSelector =
    '//span[contains(text(), "Connection")]/parent::span/parent::div/parent::div/following-sibling::div//span';
  const buttonSelector = value => `//*[text() = "${value}"]`;
  const emailConfirmationSelector =
    '//*[contains(text(), "request a new confirmation link")]';
  const paginationSelector = '//li[contains(@class, "pagination")]';
  const suggestionSel = '//*[contains(@class, "triggered-content")]';
  const defaultCheckbox = '//*[contains(@for, "sf-geoRegion")]';

  let cookies = job.account.li_cookies;
  const emailGmail = job.account.gmail.email;
  const password = job.account.gmail.password;
  const recoveryEmail = job.account.gmail.recovery_email;
  const passwordLinkedIn = job.account.li_password;
  const phoneNumber = job.account.gmail.phone;
  const firstNameValue = job.account.profile_details["first_name"];
  const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
  const numParsedUsers = job.account.num_connections;
  const job_id = job.id;
  console.log("job", job_id);

  const name = job.data.search_name;
  const location = job.data.search_location;
  let numberOfAddingTimes = job.data.iter_number;
  const group = job.data.groups;

  try {
    let main = await extLoginFunc.signIn(
      emailGmail,
      password,
      recoveryEmail,
      passwordLinkedIn,
      phoneNumber,
      firstNameValue,
      proxy,
      cookies,
      job_id
    );

    if (main[0] === "restricted" || main[0] === "robot") {
      console.log("Account restricted");
      browser = main[1];
      await axios
        .post(
          `${domain}/api/core/common/account/${job_id}/event/`,
          JSON.stringify({
            data: {
              eventType: "account_blocked"
            }
          })
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    } else {
      page = main[0];
      browser = main[1];

      await page.waitFor(waitingTime);
      await page.keyboard.press("Escape");

      const notNow = await page
        .waitForXPath(buttonSelector("Not now"), {
          timeout: waitingTime
        })
        .catch(() => console.log(`${errorElement} not now`));

      if (notNow) {
        await notNow.click();
      }

      // In case that we need to confirm an email
      const emailConfirmation = await page
        .waitForXPath(emailConfirmationSelector, { timeout: waitingTime })
        .catch(() => console.log("no need to confirm an email"));
      if (emailConfirmation) {
        // We need to confirm an email
        const confirmURL = await page.url();
        await emailConfirmation.click();
        const emailPage = await browser.newPage();
        const confirmationPage = await browser.newPage();
        await verificateEmail(
          emailPage,
          emailGmail,
          password,
          recoveryEmail,
          phoneNumber,
          "Confirmation Link",
          firstNameValue,
          passwordLinkedIn,
          confirmationPage
        );
        await emailPage.close();
        await confirmationPage.close();
        await page.goto("https://www.linkedin.com/feed/", {
          waitUntil: "domcontentloaded",
          referer: confirmURL
        });
      }

      await page.waitFor(waitingTime * 3);

      // Check notifications and messages

      const notifications = await page.waitForXPath(
        buttonSelector("Notifications")
      );
      await notifications.click().catch(() => console.log("Can't click"));
      await page.waitFor(waitingTime * 2);

      const messages = await page.waitForXPath(buttonSelector("Messaging"));
      await messages.click().catch(() => console.log("Can't click"));
      const submBtn = await page
        .waitForXPath(submitClassSelector, { timeout: waitingTime })
        .catch(() => console.log(`${errorElement} button`));

      if (submBtn) {
        await submBtn.click();
      }

      const gotItBtn = await page
        .waitForXPath(buttonSelector("Got it"), { timeout: waitingTime })
        .catch(() => console.log("No need to skip"));

      if (gotItBtn) {
        await gotItBtn.click();
      }

      await page.waitFor(waitingTime * 2);

      //  Check if smbd invite you to create connection
      const connections = await page.waitForXPath(buttonSelector("My Network"));
      await connections.click();
      await page.waitFor(waitingTime * 3);
      const invitations = await page
        .$x(buttonSelector("Accept"))
        .catch(() => console.log("There aren't any invitation"));
      if (invitations.length > 0) {
        for (let i in invitations) {
          await invitations[i].click();
          await page.waitFor(waitingTime);
        }
      }

      const dismissInfobox = await page
        .waitForXPath(dismissInfoboxSelector, { timeout: waitingTime })
        .catch(() => console.log("No need to dismiss"));

      if (dismissInfobox) {
        await dismissInfobox.click();
      }
      // Come back to home page
      const home = await page.waitForXPath(buttonSelector("Home"));
      await home.click();
      await page.waitFor(waitingTime);

      // Make some likes
      await extLoginFunc.addLikes(page);

      // Add some groups
      await extLoginFunc.connectToGroup(browser, page, group);

      await page.bringToFront();

      // Searching for user
      let status = await searchAddFriends();
      if (status === "success") {
        if (noCityStatus) {
          numberOfAddingTimes *= 2;
        }
      }

      // Enter to Job category and scroll a little bit
      const job = await page.waitForXPath(buttonSelector("Jobs"));
      await job.click();
      await page.waitFor(waitingTime);
      await page
        .waitForFunction(() => {
          return window.scrollBy(0, window.innerHeight);
        })
        .catch(() => console.log("scrolled"));
      await page.waitFor(waitingTime * 2);
      const seeMoreButton = await page
        .waitForXPath(buttonSelector("See more jobs"), { timeout: waitingTime })
        .catch(() => console.log("Can't find"));
      const seeMoreCompaniesButton = await page
        .waitForXPath(buttonSelector("See more companies"), {
          timeout: waitingTime
        })
        .catch(() => console.log("Can't find"));
      if (seeMoreButton) {
        await seeMoreButton.click();
        await page
          .waitForFunction(() => {
            return window.scrollBy(1280, window.innerHeight + 1280);
          })
          .catch(() => console.log("scrolled"));
      } else if (seeMoreCompaniesButton) {
        await seeMoreCompaniesButton.click();
        await page
          .waitForFunction(() => {
            return window.scrollBy(1280, window.innerHeight + 1280);
          })
          .catch(() => console.log("scrolled"));
      } else {
        await page
          .waitForFunction(() => {
            return window.scrollBy(680, window.innerHeight + 680);
          })
          .catch(() => console.log("scrolled"));
      }

      await page.waitFor(waitingTime);
      const actualURL = await page.url();

      await page.goto("https://www.linkedin.com/feed/", {
        waitUntil: "domcontentloaded",
        referer: actualURL
      });
      await page.waitFor(waitingTime * 3);

      // Grab number of connections
      let numConnections = await page
        .waitForFunction(
          sel => {
            return document.evaluate(
              sel,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText;
          },
          { timeout: waitingTime * 3 },
          connectionSelector
        )
        .catch(() => console.log("You have no friends"));

      if (numConnections) {
        let actualNumber = numConnections._remoteObject.value;
        actualNumber = actualNumber.trim();
        console.log(actualNumber);
        await axios
          .post(
            `${domain}/api/core/common/account/${job_id}/event/`,
            JSON.stringify({
              data: {
                eventType: "num_connections",
                n: actualNumber
              }
            })
          )
          .then(res => console.log(res))
          .catch(err => console.log(err));

        await page.waitFor(waitingTime * 2);

        // TODO: Waiting for Gal's response to decide if need this data

        // Check how many users we've already parsed
        // const targetNumber = actualNumber - numParsedUsers;
        // if (targetNumber >= 10) {
        //   const result = await dataCollector(page, targetNumber, actualNumber);
        //   if (result) {
        //     await axios
        //       .put(
        //         `${domain}/api/update-parsed-pages`,
        //         JSON.stringify({
        //           number: actualNumber,
        //           id
        //         })
        //       )
        //       .then(res => console.log(res))
        //       .catch(err => console.log(err));
        //   }
        // } else {
        //   console.log("Not enough data to collect");
        // }
      } else {
        console.log("There aren't any connections");
      }
    }

    async function searchAddFriends() {
      let innerStatus = "success";
      console.log("inside");
      const searchBox = await page
        .waitForXPath(searchBoxSelector)
        .catch(async () => await page.reload());

      await page.waitFor(waitingTime);
      await searchBox.click({ clickCount: 3 });
      await searchBox.type(name, { delay: delayNum() });
      await page.keyboard.press("Enter");

      // Check if groups were selected
      await page.waitFor(waitingTime * 2);
      const groupSelected = await page
        .waitForXPath(buttonSelector("Groups"), { timeout: waitingTime })
        .catch(() => console.log("People selected"));
      if (groupSelected) {
        await groupSelected.click();
        const peopleSelect = await page.waitForXPath(buttonSelector("People"));
        await peopleSelect.click();
      }

      await page.waitFor(waitingTime * 4);
      const curURL = await page.url();
      console.log(curURL);
      if (!curURL.includes("https://www.linkedin.com/search/results/people/")) {
        await page.goBack();
      }

      await page.waitFor(waitingTime);
      const allFilters = await page.waitForXPath(buttonSelector("All Filters"));
      await allFilters.click();

      const locInput = await page.waitForXPath(locInputSelector);
      await page.waitFor(waitingTime);
      await locInput.click();
      await locInput.type(location, { delay: delayNum() });

      await page.waitFor(waitingTime);
      const suggestions = await page
        .$x(suggestionSel, { timeout: waitingTime * 2 })
        .catch(() => console.log("No suggestions"));
      if (suggestions) {
        await suggestions[0].click();
      }
      await page.waitFor(waitingTime);

      const clearItems = await page
        .evaluate(
          sel =>
            document.evaluate(
              sel,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText,
          clearButtonSelector
        )
        .catch(() => console.log(`${errorElement} clear button`));
      if (clearItems !== "1") {
        const firstDefault = await page.$x(defaultCheckbox);
        await firstDefault[0].click();
      }

      const applyButton = await page
        .waitForXPath(applyBtnSelector)
        .catch(() => console.log(`${errorElement} apply button`));
      console.log("found a button");
      await applyButton.click();

      const url = await page.url();
      if (url === "https://www.linkedin.com/search/results/all/") {
        console.log("Something went wrong 2");
        await page.reload();
        await searchAddFriends();
      } else {
        for (let i = 1; i < numberOfAddingTimes + 1; i++) {
          await connect();

          // Catch() - It could be less pages then numberOfAddingTimes, so in this case we stop adding friends in current number
          count = await changePage(count, page).catch(() =>
            console.log(`${errorElement} switch to another page`)
          );
          console.log("current count", count);

          await page.waitFor(waitingTime);

          const currentUrl = await page.url();
          console.log("current url", currentUrl);
          if (
            !currentUrl.includes(
              "https://www.linkedin.com/search/results/people/"
            )
          ) {
            await page.goBack({
              timeout: waitingTime * 3,
              waitUntil: "domcontentloaded"
            });
            await page.waitFor(waitingTime * 4);

            await page
              .waitForFunction(() => {
                return window.scrollBy(0, window.innerHeight);
              })
              .catch(() => console.log("scrolled"));

            await page.waitFor(waitingTime);
          }

          const numPage = await page
            .evaluate(sel => {
              const result = [];
              const el = document.evaluate(
                sel,
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
              );
              for (let i = 0, length = el.snapshotLength; i < length; i++) {
                result.push(el.snapshotItem(i));
              }
              return result[result.length - 1].innerText;
            }, paginationSelector)
            .catch(() => console.log("End of the list"));

          if (!numPage) {
            break;
          }

          if (count > parseInt(numPage)) {
            break;
          }

          if (count > 15) {
            break;
          }

          if (isNaN(count)) {
            break;
          }
        }
      }
      return innerStatus;
    }

    // Adding to connections
    async function connect() {
      // Scrolling down the page
      await page
        .waitForFunction(
          () => {
            return window.scrollBy(0, window.innerHeight);
          },
          { timeout: waitingTime }
        )
        .catch(() => console.log("scrolled"));

      const toasts = await page
        .$x(dismissSelector)
        .catch(() => console.log(`${errorElement}  toasts`));
      if (toasts.length > 0) {
        for (let i in toasts) {
          await toasts[i].click();
        }
      }

      const connectBut = await page
        .$x(buttonSelector("Connect"))
        .catch(() => console.log(`${errorElement} connect button`));
      console.log(connectBut.length);
      await page.waitFor(waitingTime);

      let num = randomRefreshOneToFive();
      if (connectBut[num - 1]) {
        await connectBut[num - 1].click();

        const submitText = await page
          .waitForXPath(buttonSelector("Done"), { timeout: waitingTime })
          .catch(() => console.log(`${errorElement} done button`));

        const submitText2 = await page
          .waitForXPath(buttonSelector("Send now"), {
            timeout: shortWaitingTime
          })
          .catch(() => console.log(`${errorElement} send now button`));

        const submitClass = await page
          .waitForXPath(submitClassSelector, { timeout: waitingTime })
          .catch(() => console.log(`${errorElement} class button`));

        if (submitText) {
          await submitText.click();
        } else if (submitText2) {
          await submitText2.click();
        } else if (submitClass) {
          await submitClass.click();
        }
        console.log("friend was added");
      } else {
        console.log("friend wasn't added, change page");
        numberOfAddingTimes++;
      }

      await page.keyboard.press("Escape");
    }
  } catch (err) {
    throw err;
  } finally {
    await browser.close();
    await axios
      .post(`${domain}/api/core/common/job/${job_id}/end/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};
