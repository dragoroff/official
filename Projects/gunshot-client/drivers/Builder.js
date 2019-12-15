const puppeteer = require("puppeteer");
const verificateEmail = require("../helpers/verification").verificateEmail;
const axios = require("axios");
const domain = require("../helpers/domain").domain;

// SignUp
module.exports.signUp = async function signUp(job) {
  const passwordLinkedIn = job.account.li_password;
  const firstNameValue = job.account.profile_details["first_name"];
  const lastNameValue = job.account.profile_details["last_name"];
  const emailGmail = job.account.gmail.email;
  const password = job.account.gmail.password;
  const recoveryEmail = job.account.gmail.recovery_email;
  const phoneNumber = job.account.gmail.phone;
  const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;

  let school = job.account.profile_details.education["university"];
  let degree = job.account.profile_details.education["degree"];
  let specialization = job.account.profile_details.education["field"];
  let yearStart = job.account.profile_details.education["dates"].split(
    " – "
  )[0];
  let yearEnd = job.account.profile_details.education["dates"].split(" – ")[1];

  if (!school) {
    school = "Common University";
  }
  if (!degree) {
    degree = "Bachelor";
  }
  if (!specialization) {
    specialization = "Manager";
  }

  console.log(school, degree, specialization);
  console.log(proxy);
  console.log(emailGmail);
  console.log(password);
  console.log(recoveryEmail);
  console.log(firstNameValue);
  console.log(lastNameValue);
  console.log(passwordLinkedIn);
  console.log(phoneNumber);
  console.log(yearStart, "-", yearEnd);

  const urlLinkedin = "https://www.linkedin.com/";

  let delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
  };
  let Cookies;
  let gmailActive = false;

  const waitingTime = 3000;
  const shortWaitingTime = 1000;
  const timeout = 30000;

  const errorElement = "Can't find";

  const regFormSelector = '//form[@id = "regForm"]';
  const formFieldSelector = function(field) {
    const formattedField = field
      .toLowerCase()
      .split("")
      .filter(x => x !== " ")
      .join("");
    return `//label[contains(text(), "${field}")]/following-sibling::input[@id = "reg-${formattedField}"]`;
  };
  const buttonSelector = '//input[contains(@value, "Join")]';
  const radioInputSelector = "sms";
  const titleConfirmSel = '//h1[contains(text(), "confirm")]';
  const emailConfirmInputSel = "#email-confirmation-input";
  const verificCodeSelector = '//*[contains(text(), "Please confirm")]';
  const btnSelector = value => `//button[text() = "${value}"]`;
  const schoolInputSelector = value =>
    `//label[text() = "${value}"]/following-sibling::div//input`;
  const startYearSelector = "#onboarding-profile-edu-start-year";
  const endYearSelector = "#onboarding-profile-edu-end-year";
  const userExistSelector = '//*[contains(@id, "login-callout")]';
  const signUpSel = '//*[text() = "Join now"]';
  const idSelector = value => `//*[@id = "${value}"]`;
  const continueButtonSel = '//button[contains(@class, "secondary")]';
  const robotSelector = '//*[contains(@id, "captcha")]';
  const textSelector = value => `//*[text() = "${value}"]`;
  const welcomeSelector = "//*[contains(text(), 'Welcome')]";
  const containsId = '//*[contains(@id, "input")]';

  const firstName = "First name";
  const lastName = "Last name";
  const email = "Email";
  const passwordText = "Password";

  const submitElement = async (value, page) => {
    const submitBtn = await page
      .waitForFunction(
        sel => {
          if (document) {
            const iframe = document.getElementsByTagName("iframe")[1];
            if (iframe) {
              const element = iframe.contentWindow.document.getElementById(sel);
              if (element) {
                return element;
              }
            }
          }
        },
        { timeout: waitingTime },
        value
      )
      .catch(() => console.log("Button is disabled"));
    return submitBtn;
  };

  let secureCode;

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

  try {
    const emailPage = await browser.newPage();
    const page = await browser.newPage();
    await page.deleteCookie();

    // Several tryings to enter LinkedIn's webpage
    let status, proxyDead;
    for (let i = 0; i < 5; i++) {
      await page
        .goto(`${urlLinkedin}`, {
          waitUntil: "domcontentloaded",
          timeout
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
      throw new Error("End");
    }

    await page.waitFor(waitingTime * 3);

    //Fill in signup form
    const regForm = await page
      .waitForXPath(regFormSelector, { timeout: waitingTime })
      .catch(() => console.log(`${errorElement} sign up form`));

    if (!regForm) {
      const joinNow = await page
        .waitForXPath(signUpSel, { timeout: waitingTime })
        .catch(() => console.log(`${errorElement} join now button`));
      if (joinNow) {
        await joinNow.click();
        await page.waitFor(waitingTime);

        const emailInput = await page.waitForXPath(idSelector("join-email"));
        const passInput = await page.waitForXPath(idSelector("join-password"));

        await emailInput.type(emailGmail, { delay: delayNum() });
        await passInput.type(passwordLinkedIn, { delay: delayNum() });

        const submitButton = await page.waitForXPath(
          idSelector("submit-join-form-text")
        );
        await submitButton.click();

        const nameInput = await page.waitForXPath(idSelector("first-name"));
        const lastnameInput = await page.waitForXPath(idSelector("last-name"));

        await nameInput.type(firstNameValue, { delay: delayNum() });
        await lastnameInput.type(lastNameValue, { delay: delayNum() });

        const continueButton = await page.waitForXPath(continueButtonSel);
        await continueButton.click();

        await page.waitFor(waitingTime * 2);

        const robotCheck = await page
          .waitForXPath(robotSelector, { timeout: waitingTime })
          .catch(() => console.log("no need to robot check"));
        if (robotCheck) {
          await axios
            .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
          throw new Error();
        }
      }
    } else {
      await fillForm(
        firstNameValue,
        lastNameValue,
        emailGmail,
        passwordLinkedIn
      );

      await page.waitFor(waitingTime);
    }
    async function fillForm(name, name2, mail, pass) {
      let nameField;
      let lastNameField;
      let emailField;
      let passwordField;

      if (name) {
        await page.waitFor(waitingTime);
        nameField = await page.waitForXPath(formFieldSelector(firstName));
        await nameField.click({ clickCount: 3 });
        await nameField.type(name, { delay: delayNum() });
      }
      if (name2) {
        await page.waitFor(waitingTime);
        lastNameField = await page.waitForXPath(formFieldSelector(lastName));
        await lastNameField.click({ clickCount: 3 });
        await lastNameField.type(name2, { delay: delayNum() });
      }
      if (mail) {
        await page.waitFor(waitingTime);
        emailField = await page.waitForXPath(formFieldSelector(email));
        await emailField.click({ clickCount: 3 });
        await emailField.type(mail, { delay: delayNum() });
      }
      if (pass) {
        await page.waitFor(waitingTime);
        passwordField = await page.waitForXPath(
          formFieldSelector(passwordText)
        );
        await passwordField.click({ clickCount: 3 });
        await passwordField.type(pass, { delay: delayNum() });
      }

      const submitRegistration = await page.waitForXPath(buttonSelector);
      await submitRegistration.click();
    }

    // If account is already exist
    await page.waitFor(waitingTime * 3);
    const accountExist = await page
      .waitForXPath(userExistSelector, {
        timeout: waitingTime,
        visible: true
      })
      .catch(() => console.log("User doesn't exist"));
    if (accountExist) {
      await axios
        .post(
          `${domain}/api/core/common/account/${job.id}/event/`,
          JSON.stringify({
            data: {
              eventType: "email_invalid"
            }
          })
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));

      throw new Error("Account Exist");
    }

    // Welcome page
    const welcome = await page
      .waitForXPath(welcomeSelector, { timeout: waitingTime * 2 })
      .catch(() => console.log(`${errorElement} welcome`));

    const urlPage = await page.url();
    //Security verification
    if (!urlPage.includes("feed")) {
      if (!welcome) {
        const sendCodeButton = await submitElement("submitPage1", page);
        const sendCodeButton2 = await page
          .waitForXPath(idSelector("submitChallenge"), { timeout: waitingTime })
          .catch(() => console.log(`${errorElement} second button`));
        if (!sendCodeButton && !sendCodeButton2) {
          // Disable email and proxy
          await axios
            .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
          throw new Error("Proxy Dead");
        } else {
          // Make sure to get sms, but not a call
          const radioInput = await page
            .waitForFunction(
              sel => {
                if (document) {
                  const iframe = document.getElementsByTagName("iframe")[1];
                  if (iframe) {
                    const radio = iframe.contentWindow.document.getElementById(
                      sel
                    );
                    if (!radio.checked) {
                      return radio;
                    }
                  }
                }
              },
              { timeout: waitingTime * 2 },
              radioInputSelector
            )
            .catch(() => console.log("radio button has already been checked"));
          if (radioInput) {
            await radioInput.click();
          }

          const phoneInput = await submitElement("phoneNumber", page);
          if (phoneInput) {
            await phoneInput.click();
            await phoneInput.type(phoneNumber, { delay: delayNum() });
          } else {
            const phoneInput2 = await page
              .waitForXPath(idSelector("phoneNumber"), { timeout: waitingTime })
              .catch(() =>
                console.log(`${errorElement} phone input 2 as well`)
              );
            await phoneInput2.click();
            await phoneInput2.type(phoneNumber, { delay: delayNum() });
          }

          const sendCodeButton = await submitElement("submitPage1", page);
          if (sendCodeButton) {
            await sendCodeButton.click();
          } else {
            const sendCodeButton2 = await page
              .waitForXPath(idSelector("submitChallenge"), {
                timeout: waitingTime
              })
              .catch(() => console.log(`${errorElement} submit`));
            await sendCodeButton2.click();
          }

          await page.waitFor(waitingTime);

          secureCode = await verificateEmail(
            emailPage,
            emailGmail,
            password,
            recoveryEmail,
            phoneNumber,
            undefined,
            firstNameValue
          );

          // We entered to Gmail so we don't need to access one more time
          gmailActive = true;

          console.log("secureCode", secureCode);
          if (!secureCode) {
            console.log("Something wrong with email credentials");

            await axios
              .post(`${domain}/api/core/common/job/${job.id}/email/dead/`)
              .then(res => console.log(res))
              .catch(err => console.log(err));

            throw new Error("Something wrong with email credentials");
          }
          await page.waitFor(waitingTime);

          await page.bringToFront();

          // Coming back to linkedin and passing verification code
          const verifInput = await page
            .waitForXPath(containsId, {
              timeout: waitingTime * 2
            })
            .catch(() => console.log(`${errorElement} verif input`));
          const verifInput2 = await page
            .waitForXPath(textSelector("Verification code"), {
              timeout: waitingTime
            })
            .catch(() => console.log(`${errorElement} second verif input`));

          if (verifInput) {
            await verifInput.click();
            await verifInput.type(secureCode, { delay: delayNum() });
          } else if (verifInput2) {
            await verifInput2.type(secureCode, { delay: delayNum() });
          } else {
            await axios
              .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
              .then(res => console.log(res))
              .catch(err => console.log(err));
          }

          const verifSubmit = await submitElement("submitPage2", page);
          if (verifSubmit) {
            await verifSubmit.click();
          } else {
            // Try to find any button
            const confirmButton = await page.waitForXPath(
              idSelector("submitChallenge")
            );
            await confirmButton.click();
          }
          await page.waitFor(waitingTime * 2);

          const robotCheck2 = await page
            .waitForXPath(robotSelector, { timeout: waitingTime })
            .catch(() => console.log("no need to robot check"));
          if (robotCheck2) {
            await axios
              .post(`${domain}/api/core/common/job/${job.id}/proxy/dead/`)
              .then(res => console.log(res))
              .catch(err => console.log(err));
            throw new Error();
          }
        }
      }
      //Skip Location
      let url = await page.url();
      const skipStep = await page
        .waitForXPath(btnSelector("Next"))
        .catch(() => console.log(`${errorElement} next button`));

      if (skipStep) {
        await skipStep.click();
      }

      await page.waitFor(timeout / 2);

      // Checking of next button's bug
      let nextUrl = await page.url();

      if (url === nextUrl) {
        console.log("Can't click on next button");
      } else {
        //Education
        const studentBut = await page.waitForXPath(
          btnSelector("I’m a student")
        );

        await studentBut.click();
        await page.waitFor(waitingTime / 2);

        const schoolInput = await page.waitForXPath(
          schoolInputSelector("School or College/University")
        );

        await schoolInput.click();
        await schoolInput.type(school, { delay: delayNum() });
        await page.keyboard.press("Escape");

        const degreeInput = await page
          .waitForXPath(schoolInputSelector("Degree"), {
            timeout: waitingTime
          })
          .catch(() => console.log(`${errorElement} degree`));
        if (degreeInput) {
          await degreeInput.click();
          await degreeInput.type(degree, { delay: delayNum() });
        }
        const specializInput = await page
          .waitForXPath(schoolInputSelector("Specialization"), {
            timeout: waitingTime
          })
          .catch(() => console.log(`${errorElement} degree`));
        if (specializInput) {
          await specializInput.click();
          await specializInput.type(specialization, { delay: delayNum() });
        }
        if (!yearStart || !yearEnd) {
          yearStart = 2012;
          yearEnd = 2016;
        }
        await page.select(startYearSelector, yearStart.toString());
        await page.select(endYearSelector, yearEnd.toString());
        await page.waitFor(shortWaitingTime);

        const buttonContinue = await page
          .waitForFunction(
            sel => {
              const button = document.evaluate(
                sel,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (!button.disabled) {
                return button;
              }
            },
            {},
            btnSelector("Continue")
          )
          .catch(() =>
            console.log("Button is disabled or not part of the DOM")
          );
        await buttonContinue.click();

        //Confirm an email
        // 1. Let's confirm
        const letConfirmEmail = await page
          .waitForXPath(titleConfirmSel)
          .catch(() =>
            console.log(`${errorElement} title: Let's confirm your email`)
          );

        if (letConfirmEmail) {
          await confirmEmail();
        }
      }

      await page.waitFor(waitingTime * 2);

      await page.goto(`${urlLinkedin}feed/`, {
        waitUntil: "domcontentloaded",
        referer:
          "https://www.google.com/search?q=linkedin&oq=linkedin&sourceid=chrome&ie=UTF-8"
      });
    }

    await page.waitFor(waitingTime);
    await page.keyboard.press("Escape");
    await page.waitFor(waitingTime * 3);
    Cookies = await page.cookies();

    await axios
      .post(
        `${domain}/api/core/common/account/${job.id}/event/`,
        JSON.stringify({
          data: {
            eventType: "created",
            cookies: JSON.stringify(Cookies)
          }
        })
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));

    // Confirm email
    async function confirmEmail() {
      try {
        if (!gmailActive) {
          // Enter to gmail
          await verificateEmail(
            emailPage,
            emailGmail,
            password,
            recoveryEmail,
            phoneNumber,
            "Enter",
            firstNameValue
          );
        }
        console.log("Verif func run");
        let verificCode = await emailPage
          .waitForFunction(
            sel => {
              const text = document.evaluate(
                sel,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue.innerText;
              return text;
            },
            {},
            verificCodeSelector
          )
          .catch(() => console.log(`${errorElement} the code`));
        if (!verificCode) {
          console.log("Email wasn't confirmed");
          await axios
            .post(`${domain}/api/core/common/job/${job.id}/email/dead/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
          throw new Error("Email wasn't confirmed");
        } else {
          const str = ", your pin is ";
          verificCode = verificCode._remoteObject.value.slice(
            firstNameValue.length + str.length,
            firstNameValue.length + str.length + 6
          );

          await page.bringToFront();
          const emailConfirmInput = await page.waitForSelector(
            emailConfirmInputSel
          );
          await emailConfirmInput.click();
          await emailConfirmInput.type(verificCode, { delay: delayNum() });
          await page.keyboard.press("Enter");
        }
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
    await axios
      .post(`${domain}/api/core/common/job/${job.id}/end/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};
