module.exports.changePage = async function changePage(count, page) {
  const timeout = 60000;
  const polling = 2000;
  const errorElement = "Can't find";
  const waitingTime = 3000;
  const buttonSelector = value => `//*[text() = ${value}]`;

  try {
    await page
      .waitForFunction(
        () => {
          return window.scrollBy(0, window.innerHeight);
        },
        { polling, timeout: waitingTime * 2 }
      )
      .catch(() => console.log("scrolled"));
    count++;

    await page.waitFor(waitingTime);
    const nextPage = await page.$x(buttonSelector(`${count}`)).catch(() => {
      console.log(`${errorElement} pagination button`);
    });
    if (nextPage.length > 0) {
      await nextPage[0].click();
      console.log("Moved to another page");
    } else {
      const disabledNextButton = await page
        .evaluate(sel => {
          const el = document.evaluate(
            sel,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue.parentElement;
          if (el.disabled) {
            return true;
          }
        }, buttonSelector("Next"))
        .catch(() => console.log(`${errorElement} next button`));
      if (disabledNextButton) {
        return count;
      } else {
        const threeDots = await page
          .$x("//span[text() = '…']")
          .catch(() => console.log("Something went wrong"));
        if (threeDots.length === 2) {
          console.log("three dots clicked");
          await threeDots[1].click();
        } else if (threeDots.length === 1) {
          await threeDots[0].click();
        } else {
          return count;
        }
      }
    }

    await page.waitFor(waitingTime);

    return count;
  } catch (err) {
    throw err;
  }
};
