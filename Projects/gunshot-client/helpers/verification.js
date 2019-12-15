module.exports.verificateEmail = async function getVerificationNumber(
  emailPage,
  emailGmail,
  password,
  recoveryEmail,
  phoneNumber,
  status,
  firstNameValue,
  passwordLinkedIn,
  confirmationPage
) {
  let delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
  };
  const waitingTime = 3000;
  const errorElement = "Can't find";

  const chooseAccountSelector = '//h1[text() = "Choose an account"]';
  const anotherAccountSelector = '//p[text() = "Use another account"]';
  const nextButtonSelector = '//span[contains(text(), "Next")]';
  const inputSelector = value =>
    `//*[contains(text(), "${value}")]/preceding-sibling::input`;
  const messageSelector = value =>
    `//*[contains(text(), "${value}")]/parent::span/parent::div/following-sibling::span`;
  const verificMsgSelector = `//*[contains(text(), "${firstNameValue}, here's your PIN")]/parent::span/parent::div/following-sibling::span`;
  const verificSelector = value => `//td[contains(text(), "${value}")]`;
  const verifPageSelector = '//h1[contains(text(), "Verify")]';
  const confirmEmailSelector = value =>
    `//div[contains(text(), "Confirm your recovery ${value}")]`;
  const textSelector = value => `//*[text() = "${value}"]`;
  const fieldSelector = value => `//input[@aria-label = "${value}"]`;
  const linkedinMessageSel = '//a[contains(text(), "linkedin")]';
  let code, error;

  try {
    console.log("status", status);
    await emailPage.bringToFront();
    await emailPage.goto(
      "https://accounts.google.com/ServiceLogin/identifier?hl=en",
      {
        waitUntil: "domcontentloaded"
      }
    );
    await emailPage.waitFor(waitingTime * 2);

    // Check if already registered any accounts
    const chooseAccount = await emailPage
      .$x(chooseAccountSelector)
      .catch(() => console.log("choose account"));
    if (chooseAccount.length > 0) {
      await emailPage.waitFor(waitingTime);
      const anotherAccount = await emailPage.$x(anotherAccountSelector);
      await anotherAccount[0].click();
    }

    // passing email and password
    await emailPage.waitFor(waitingTime);

    const signInPage = await emailPage
      .$x(textSelector("Sign in"))
      .catch(() => console.log(`${errorElement} sign in page`));

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

      const nextBtnPassword = await emailPage.waitForXPath(nextButtonSelector);
      await nextBtnPassword.click();

      await emailPage.waitFor(waitingTime * 2);

      // skip if asked about double verification security
      const doneButton = await emailPage
        .waitForXPath(textSelector("Done"), { timeout: waitingTime })
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
          .waitForXPath(confirmEmailSelector("email"), { timeout: waitingTime })
          .catch(() =>
            console.log(`${errorElement} confirmation using recovery email`)
          );
        if (confirmEmail) {
          await confirmEmail.click();
          await emailPage.waitFor(waitingTime);
          const recovEmailInput = await emailPage.waitForXPath(
            inputSelector("Enter")
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
            fieldSelector("Phone number")
          );
          await recovPhoneInput.type(phoneNumber, { delay: delayNum() });
        }

        const nextBtn = await emailPage
          .waitForXPath(nextButtonSelector, { timeout: waitingTime * 2 })
          .catch(() => console.log(`${errorElement} next button`));
        if (nextBtn) {
          await nextBtn.click();
        }
      }

      await emailPage.waitFor(waitingTime / 2);
      await emailPage.goto("https://mail.google.com/mail/", {
        waitUntil: "domcontentloaded"
      });

      //Find Google Voice Email
      await emailPage.waitFor(waitingTime * 3);
      await emailPage.keyboard.press("Escape");
      await emailPage.keyboard.press("Escape");

      await emailPage.keyboard.press("Enter");
      await emailPage.keyboard.press("Enter");

      if (status === "Suspicious login") {
        console.log("Suspicious login checking");
        let verificMsg = await emailPage
          .waitForFunction(
            sel => {
              if (document.documentElement) {
                const messageNode = document.evaluate(
                  sel,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                if (messageNode) {
                  return messageNode;
                } else {
                  return `${errorElement} single node`;
                }
              }
            },
            {},
            verificMsgSelector
          )
          .catch(() => {
            console.log("waiting for message");
          });

        await verificMsg.click();
        await emailPage.waitFor(waitingTime);

        code = await emailPage.waitForFunction(
          sel => {
            let results = [];
            const text = document.evaluate(
              sel,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            for (let i = 0, length = text.snapshotLength; i < length; ++i) {
              results.push(text.snapshotItem(i));
            }
            const code = results[results.length - 1].innerText;
            return code;
          },
          {},
          verificSelector(
            "Please use this verification code to complete your sign in:"
          )
        );

        code = code._remoteObject.value.slice(60, 66);

        console.log("code", code);
      } else if (status === "Enter") {
        console.log("Entered");
        throw "Exit";
      } else if (status === "Confirmation Link") {
        console.log("Confirmation");
        const messageFromLinkedIn = await emailPage
          .waitForFunction(
            sel => {
              const messageNode = document.evaluate(
                sel,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue;
              if (messageNode) {
                return messageNode;
              }
            },
            {},
            messageSelector("Confirm your email address")
          )
          .catch(() => console.log(`${errorElement} element`));

        await messageFromLinkedIn.click();

        const link = await emailPage.waitForFunction(
          sel => {
            const message = document.evaluate(
              sel,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (message) {
              return message.innerText;
            }
          },
          {},
          linkedinMessageSel
        );
        // Changing tab to paste a link that we've got from LinkedIn and pass password verification
        await confirmationPage.bringToFront();
        await confirmationPage.goto(link._remoteObject.value, {
          waitUntil: "domcontentloaded"
        });

        const passwordField = await confirmationPage.waitForXPath(
          fieldSelector("Password")
        );
        await passwordField.click();
        await passwordField.type(passwordLinkedIn, { delay: delayNum() });
        await confirmationPage.keyboard.press("Enter");
      } else {
        let msgFromLinkedin = await emailPage
          .waitForFunction(
            sel => {
              if (document.documentElement) {
                const messageNode = document.evaluate(
                  sel,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;
                if (messageNode) {
                  return messageNode;
                } else {
                  return `${errorElement} single node`;
                }
              }
            },
            {},
            messageSelector("New text message from")
          )
          .catch(() => console.log(`${errorElement} element`));

        if (msgFromLinkedin) {
          await msgFromLinkedin.click();
        }

        await emailPage.waitFor(waitingTime);

        code = await emailPage.waitForFunction(
          sel => {
            let results = [];
            const text = document.evaluate(
              sel,
              document,
              null,
              XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
              null
            );
            for (let i = 0, length = text.snapshotLength; i < length; ++i) {
              results.push(text.snapshotItem(i));
            }
            const code = results[results.length - 1].innerText;
            return code;
          },
          {},
          verificSelector("Your LinkedIn verification code is")
        );

        code = code._remoteObject.value.slice(35, 41);

        console.log("code", code);
      }

      await emailPage.goBack();

      return code;
    } else {
      error = true;
    }
  } catch (err) {
    console.log(err);
    // throw err;
  } finally {
    if (code) {
      console.log("End of verification");
      return code;
    } else if (error) {
      return true;
    } else {
      console.log("End of verification");
      return false;
    }
  }
};
