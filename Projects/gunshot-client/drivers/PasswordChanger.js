const puppeteer = require("puppeteer");
const axios = require("axios");
const domain = require("../helpers/domain").domain;

// 1. File with list of emails must be excel
// 2. Choose number of emails you want to change

module.exports.passwordChange = async function passwordChange(job) {
  let login, code, recovery, telephone, proxy, newPassword;
  console.log("data from inside", job);

  login = job.account.gmail.email;
  code = job.account.gmail.password;
  recovery = job.account.gmail.recovery_email;
  telephone = job.account.gmail.phone;
  proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
  newPassword = job.data["new_password"];

  console.log(`
    ${login}
    ${code}
    ${recovery}
    ${telephone}
    ${newPassword}
    ${proxy}
    `);

  const chooseAccountSelector = '//h1[text() = "Choose an account"]';
  const anotherAccountSelector = '//p[text() = "Use another account"]';
  const nextButtonSelector =
    '//span[text() = "Next"]/parent::content/parent::div';
  const inputSelector = value =>
    `//*[contains(text(), "${value}")]/preceding-sibling::input`;
  const verifPageSelector = '//h1[contains(text(), "Verify")]';
  const confirmEmailSelector = value =>
    `//div[contains(text(), "Confirm your recovery ${value}")]`;
  const recovEmailSelector =
    '//div[contains(text(), "Enter")]/preceding-sibling::input';
  const btnSelector = value => `//*[text() = "${value}"]`;
  const recovPhoneSelector = '//input[@aria-label = "Phone number"]';
  const signinLinkSelector = '//a[contains(text(), "Signing in to Google")]';

  const changePasswordSelector = '//input[contains(@aria-label, "password")]';
  const changePasswordBtnSel = '//span[text() = "Change password"]';
  const securitySelector = '//*[text() = "Security"]/parent::a';
  const verifSel = '//content[contains(text(), "Verify")]';

  const emailGmail = login;
  const password = code;
  const recoveryEmail = recovery;
  const phoneNumber = telephone;
  // const newPassword = genPass;

  const waitingTime = 3000;
  let delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
  };
  const errorElement = "Can't find";

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 800,
      width: 1280
    },
    args: [`--proxy-server=${proxy}`]
  });
  try {
    await axios
      .post(`${domain}/api/core/common/job/${job.id}/start/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));

    const emailPage = await browser.newPage();

    // Several tryings to enter LinkedIn's webpage
    let status, proxyDead;
    for (let i = 0; i < 3; i++) {
      await emailPage
        .goto("https://accounts.google.com/ServiceLogin/identifier?hl=en", {
          waitUntil: "domcontentloaded"
        })
        .then(() => (status = "Success"))
        .catch(() => (status = "Failure"));
      console.log(status);
      if (status === "Success") {
        break;
      } else {
        continue;
      }
    }
    if (status === "Failure") {
      proxyDead = true;
    }
    if (proxyDead) {
      await axios
        .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    await emailPage.waitFor(waitingTime * 2);

    // Check if already registered any accounts
    const chooseAccount = await emailPage
      .$x(chooseAccountSelector)
      .catch(() => console.log(`${errorElement} previous accounts`));
    if (chooseAccount.length > 0) {
      await emailPage.waitFor(waitingTime);
      const anotherAccount = await emailPage.$x(anotherAccountSelector);
      await anotherAccount[0].click();
    }
    // passing email and password
    await emailPage.waitFor(waitingTime);
    const signInPage = await emailPage
      .$x(btnSelector("Sign in"))
      .catch(async () => await emailPage.reload());
    if (signInPage.length > 0) {
      await emailPage.waitFor(waitingTime);
      const inputEmail = await emailPage.waitForXPath(inputSelector("Email"));
      await inputEmail.click();
      await inputEmail.type(emailGmail, { delay: delayNum() });

      const nextButton = await emailPage.waitForXPath(nextButtonSelector);
      await nextButton.click();

      await emailPage.waitFor(waitingTime);

      const passwordInput = await emailPage.waitForXPath(
        inputSelector("Enter")
      );
      await passwordInput.click();
      await passwordInput.type(password, { delay: delayNum() });

      const nextButtonPassword = await emailPage.waitForXPath(
        nextButtonSelector
      );
      await nextButtonPassword.click();

      await emailPage.waitFor(waitingTime * 2);

      // skip if asked about double verification security
      const doneButton = await emailPage
        .waitForXPath(btnSelector("Done"), { timeout: waitingTime })
        .catch(() => console.log(`${errorElement} done button`));
      if (doneButton) {
        await doneButton.click();
      }

      // if asked about recovery email check
      const verificationPage = await emailPage
        .waitForXPath(verifPageSelector, { timeout: waitingTime })
        .catch(() => console.log("double check passed"));

      if (verificationPage) {
        const confirmEmail = await emailPage
          .waitForXPath(confirmEmailSelector("email"), {
            timeout: waitingTime
          })
          .catch(() =>
            console.log(`${errorElement} confirmation using recovery email`)
          );
        if (confirmEmail) {
          await confirmEmail.click();
          await emailPage.waitFor(waitingTime);
          const recovEmailInput = await emailPage.waitForXPath(
            recovEmailSelector
          );
          await recovEmailInput.type(recoveryEmail, {
            delay: delayNum()
          });
        } else {
          const confirmPhone = await emailPage.waitForXPath(
            confirmEmailSelector("phone number")
          );
          await confirmPhone.click();
          await emailPage.waitFor(waitingTime);

          const recovPhoneInput = await emailPage.waitForXPath(
            recovPhoneSelector
          );
          await recovPhoneInput.type(phoneNumber, { delay: delayNum() });
        }

        const nextBtn = await emailPage.waitForXPath(nextButtonSelector);
        await nextBtn.click();
      }
      await emailPage
        .goto("https://myaccount.google.com/", {
          waitUntil: "domcontentloaded"
        })
        .catch(() => count--);
      await emailPage.waitFor(waitingTime * 3);

      // The old way
      const signinLink = await emailPage
        .$x(signinLinkSelector)
        .catch(() => console.log(`${errorElement} sign in link`));
      if (signinLink.length > 0) {
        await signinLink[1].click();
      }

      const security = await emailPage
        .$x(securitySelector)
        .catch(() => console.log(`${errorElement} password button`));
      if (security.length > 0) {
        await security[1].click();
      }

      await emailPage.waitFor(waitingTime * 2);
      const passwordLink = await emailPage
        .waitForXPath(btnSelector("Password"), { timeout: waitingTime })
        .catch(() => console.log(`${errorElement} password link`));
      if (passwordLink) {
        await passwordLink.click();
        console.log("Click");
        const passInput = await emailPage.waitForXPath(inputSelector("Enter"));
        await passInput.click();

        await passInput.type(password, { delay: delayNum() });

        const nextBtnPassword = await emailPage.waitForXPath(
          nextButtonSelector
        );
        await nextBtnPassword.click();

        await emailPage.waitFor(waitingTime * 2);

        const verifyByPhone = await emailPage
          .waitForXPath(verifSel, { timeout: waitingTime * 2 })
          .catch(() => console.log("Everything is right"));

        if (verifyByPhone) {
          await axios
            .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        } else {
          const changePassword = await emailPage.$x(changePasswordSelector);
          for (let i = 0; i < 2; i++) {
            await changePassword[i].click();
            await changePassword[i].type(newPassword, { delay: delayNum() });
          }
          const changePasswordBtn = await emailPage.waitForXPath(
            changePasswordBtnSel
          );
          await changePasswordBtn.click();

          await axios
            .post(`${domain}/api/core/gmail/passchanged/${job.id}/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        }
      }
    } else {
      console.log("Can't find Sign In");
    }
  } catch (err) {
    throw err;
  } finally {
    await browser.close();
    await axios
      .post(`${domain}/api/core/common/job/${job.id}/end/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};
