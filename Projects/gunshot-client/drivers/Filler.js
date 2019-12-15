const extLoginFunc = require("../helpers/SignIn");
const axios = require("axios");
const moment = require("moment");
const verificateEmail = require("../helpers/verification").verificateEmail;
const domain = require("../helpers/domain").domain;
const fs = require("fs");
const path = require("path");

module.exports.progressProfile = async function progressProfile(job) {
  console.log(job.id);
  const job_id = job.id;
  const emailGmail = job.account.gmail.email;
  const password = job.account.gmail.password;
  const recoveryEmail = job.account.gmail.recovery_email;
  const passwordLinkedIn = job.account.li_password;
  const phoneNumber = job.account.gmail.phone;
  const firstNameValue = job.account.profile_details["first_name"];
  const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
  let cookies = job.account.li_cookies;
  cookies = JSON.parse(cookies);
  // const location = job.account.profile_details["location"];
  const zip = job.account.profile_details["zip_code"];

  let startYear = job.account.profile_details.education.dates.split(" – ")[0];
  let endYear = job.account.profile_details.education.dates.split(" – ")[1];
  let fieldOfStudy = job.account.profile_details.education.field;
  let summary = job.account.profile_details.summary;
  if (summary.trim() === "") {
    summary = "Open to offers";
  }
  let skillsOpt = job.account.profile_details.skills;

  if (skillsOpt.length < 5) {
    skillsOpt = [
      "Customer Service",
      "Management",
      "Communications",
      "Economics",
      "Client Support"
    ];
  }

  let school = job.account.profile_details.education["university"];
  let degree = job.account.profile_details.education["degree"];
  let company = job.account.profile_details.experience.company;
  let title = job.account.profile_details.experience.position;
  let city = job.account.profile_details.experience.location;
  const pathToAvatar = job.account.li_avatar;
  const pathtoDefaultAvatar = job.account.li_default_avatar;

  const downloadImage = async (path_to_file, name) => {
    let image_path = path.resolve(__dirname, `${name}.jpg`);
    let writer = fs.createWriteStream(image_path);
    const status = await axios
      .get(path_to_file, { responseType: "stream" })
      .then(res => {
        res.data.pipe(writer);
      })
      .then(() => true)
      .catch(() => false);

    if (status) {
      return image_path;
    }
  };
  const imageName = "avatar";
  const defaultImageName = "default";

  const pathAvatar = await downloadImage(pathToAvatar, imageName);
  const pathDefaultAvatar = await downloadImage(
    pathtoDefaultAvatar,
    defaultImageName
  );

  let avatar, defaultAvatar;
  if (pathAvatar && pathDefaultAvatar) {
    avatar = `${process.cwd()}/drivers/${imageName}.jpg`;
    defaultAvatar = `${process.cwd()}/drivers/${defaultImageName}.jpg`;
  }

  let positionExperience = job.account.profile_details.experience.duration;

  let delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
  };
  let randomFromOneToTen = Math.ceil(Math.random() * 10);

  const timeout = 60000;
  const waitingTime = 3000;
  const shortWaitingTime = 1000;

  const profileButtonSelector = '//*[text() = "Me"]/parent::div/parent::button';
  const viewProfileSelector = '//*[text() = "View profile"]';
  const dismissSelector = '//*[text() = "Dismiss"]/parent::button';

  const errorElement = "Can't find";

  const continueButtonSelector =
    '//*[text() = "Next"]/parent::div/following-sibling::div//button[contains(@class, "button-primary-medium")]';
  const continueButtonSelector2 =
    '//*[contains(@class, "pds-ge-entry-card__launch-button")]';
  const skillsSelector =
    '//*[@class = "ge-skills-checkbox-list__checkbox-label"]';
  // '//li-icon[@type = "plus-icon"]/parent::span[contains(@class, "button-secondary-large-round")]';
  const arrowDownSelector = '//button[contains(@class, "toggle-button")]';
  const labelModalSelector = value => `//label[text() = "${value}"]`;
  const letsAddSelector = value => `//p[text() = "Let’s add your ${value}"]`;
  const placeholderSelector = '//input[contains(@placeholder, "Ex")]';
  const addToProfileSel = value => `//*[text() = "${value}"]`;
  const textSelector = value => `//*[text() = "${value}"]`;
  const startYearSelector = "#edu-start-year";
  const endYearSelector = "#edu-end-year";
  const textareaSelector = '//textarea[@placeholder = "Summary"]';
  const industryCheckboxSelector = "#position-update-industry-checkbox";
  const progressPanelSelector =
    '//*[contains(@class, "pds-pcm-progress pds-profile-section")]';
  const photoPageSelector = '//h2[text() = "Add photo"]';
  const currentWorkSelector = '//input[@id = "toggle_single_date"]';
  const locationSelector = "#location-country";
  const zipCodeSelector =
    '//label[text() = "ZIP code"]/following-sibling::div//input';
  const skillsInputSelector = '//input[contains(@placeholder, "Skill")]';
  const addAnotherSkillSel = '//*[text() = "Add another skill"]';
  const positionStartMonth = "#position-start-month";
  const positionStartYear = "#position-start-year";
  const positionIndustry = "#position-industry";
  const internetIndustry = "urn:li:fs_industry:6";
  const industrySelector = "#industry-name";
  const penIconSelector = '//*[@data-control-name = "edit_top_card"]';
  const emailConfirmationSelector =
    '//*[contains(text(), "request a new confirmation link")]';
  const photoInputSelector =
    '//input[@id = "member-photo-uploader-button-upload"]';

  const continueButtonFunc = async value => {
    let continueSelector = addToProfileSel(value);
    const experienceBtn = await page
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
        continueSelector
      )
      .catch(() => console.log("Button is disabled"));
    return experienceBtn;
  };

  let status, page, browser, main;
  let locationChanged = false;

  try {
    ///////  Helper Functions ///////
    async function check() {
      const toasts = await page
        .$x(dismissSelector)
        .catch(() => console.log(`${errorElement}  toasts`));
      if (toasts.length > 0) {
        for (let i = 0; i < toasts.length; i++) {
          await toasts[i].click();
        }
      }

      const checkProgress = await page
        .waitForXPath(progressPanelSelector, { timeout: timeout / 6 })
        .catch(() => console.log("The profile is already fullfiled"));
      if (checkProgress) {
        const statusButton = await page.evaluate(sel => {
          const button = document.evaluate(
            sel,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;
          return button.classList.contains("is-toggled");
        }, arrowDownSelector);

        if (statusButton) {
          const toggleButton = await page.$x(arrowDownSelector);
          await toggleButton[0].click();
          await page.waitFor(waitingTime);
        }

        const photoInput = await page
          .waitForXPath(photoInputSelector, {
            timeout: waitingTime
          })
          .catch(() => console.log("not a file input"));
        if (photoInput) {
          await photoInput.uploadFile(avatar);
          const avatarError = await page
            .waitForXPath("//*[contains(@class, 'artdeco-toast')]", {
              timeout: waitingTime
            })
            .catch(() => console.log("no need for default photo"));
          if (avatarError) {
            console.log("avatar error");
            /// error case photo
            avatar = defaultAvatar;
          }
          await page.waitFor(timeout / 4);
          const saveImage = await page.waitForXPath(textSelector("Save"));
          await saveImage.click();

          await page.waitFor(timeout / 3);
          await page.keyboard.press("Escape");
          await check();
        } else {
          const continueButton = await page
            .waitForXPath(continueButtonSelector, { timeout: waitingTime })
            .catch(() => console.log(`${errorElement} next button`));
          if (continueButton) {
            await continueButton.click();
          } else {
            const summaryBtn = await page
              .waitForXPath(continueButtonSelector2)
              .catch(() => console.log(`${errorElement} summary button`));
            await summaryBtn.click();
          }

          await page.waitFor(waitingTime);
          await profileCompletion();
          await check();
        }
      }
    }

    async function profileCompletion() {
      await page
        .waitForXPath(labelModalSelector("School name"), {
          timeout: shortWaitingTime
        })
        .then(() => (status = "EDUCATION"))
        .catch(() => console.log("not an education page"));
      await page
        .waitForXPath(labelModalSelector("Company name"), {
          timeout: shortWaitingTime
        })
        .then(() => (status = "EXPERIENCE"))
        .catch(() => console.log("not an experience page"));
      await page
        .waitForXPath(letsAddSelector("skills"), { timeout: shortWaitingTime })
        .then(() => (status = "SKILLS"))
        .catch(() => console.log("not a skills page"));
      await page
        .waitForXPath(letsAddSelector("summary"), { timeout: shortWaitingTime })
        .then(() => (status = "SUMMARY"))
        .catch(() => console.log("not a summary page"));
      await page
        .waitForXPath(photoPageSelector, { timeout: shortWaitingTime })
        .then(() => (status = "PHOTO"))
        .catch(() => console.log("not a photo page"));
      await page
        .waitForXPath(textSelector("Degree"), { timeout: shortWaitingTime })
        .then(() => (status = "DEGREE"))
        .catch(() => console.log("not a degree page"));
      await page
        .waitForXPath(letsAddSelector("work dates"), {
          timeout: shortWaitingTime
        })
        .then(() => (status = "WORK_DATES"))
        .catch(() => console.log("not a work dates page"));
      await page
        .waitForXPath(textSelector("What is your industry?"), {
          timeout: shortWaitingTime
        })
        .then(() => (status = "INDUSTRY"))
        .catch(() => console.log("not an industry page"));
      await page
        .waitForXPath(textSelector("Where are you located?"), {
          timeout: shortWaitingTime
        })
        .then(() => (status = "LOCATION"))
        .catch(() => console.log("not a location page"));

      switch (status) {
        case "LOCATION": {
          console.log("Location");
          // await page.select(locationSelector, location);

          const inputZIP = await page.waitForXPath(zipCodeSelector);
          await inputZIP.click({ clickCount: 3 });
          await inputZIP.type(zip, { delay: delayNum() });

          await page.waitFor(waitingTime / 2);
          const locationBtn = await continueButtonFunc("Done");
          await locationBtn.click();
          locationChanged = true;
          break;
        }
        case "INDUSTRY": {
          console.log("Industry");
          await page.select(industrySelector, internetIndustry);

          await page.waitFor(waitingTime / 2);
          const industryBtn = await continueButtonFunc("Done");
          await industryBtn.click();
          break;
        }
        case "EDUCATION": {
          console.log("education");
          // Step 1
          if (!school) {
            school = " ";
          }
          const schoolInput = await page.waitForXPath(placeholderSelector);
          await schoolInput.click();
          await schoolInput.type(school, { delay: delayNum() });

          const educationButton = await continueButtonFunc("Add to profile");
          await educationButton.click();

          // Step 2
          if (!startYear) {
            startYear = "2006";
          }
          if (!endYear) {
            endYear = "2010";
          }
          await page.waitForXPath(textSelector("From"));
          await page.select(startYearSelector, startYear);
          await page.select(endYearSelector, endYear);

          const educationSecBtn = await continueButtonFunc("Save");
          await educationSecBtn.click();

          // Step 3
          if (!fieldOfStudy) {
            fieldOfStudy = " ";
          }
          await page.waitForXPath(textSelector("Field of study"));
          const inputFieldStudy = await page.waitForXPath(placeholderSelector);
          await inputFieldStudy.click();
          await inputFieldStudy.type(fieldOfStudy, { delay: delayNum() });

          const educationThirdBtn = await continueButtonFunc("Save");
          await educationThirdBtn.click();

          // Step 4
          if (!degree) {
            degree = " ";
          }
          await page.waitForXPath(textSelector("Degree"));
          const degreeInput = await page.waitForXPath(placeholderSelector);
          await degreeInput.click();
          await degreeInput.type(degree, { delay: delayNum() });

          const educationForthBtn = await continueButtonFunc("Save");
          await educationForthBtn.click();

          const doneButton = await page.waitForXPath(addToProfileSel("Done"));
          await doneButton.click();

          break;
        }
        case "DEGREE": {
          console.log("degree");
          if (!degree) {
            degree = " ";
          }
          await page.waitForXPath(textSelector("Degree"));
          const degreeInput = await page.waitForXPath(placeholderSelector);
          await degreeInput.click();
          await degreeInput.type(degree, { delay: delayNum() });

          const degreeBtn = await continueButtonFunc("Save");
          await degreeBtn.click();

          if (!fieldOfStudy) {
            fieldOfStudy = " ";
          }
          await page.waitForXPath(textSelector("Field of study"));
          const field = await page.waitForXPath(placeholderSelector);
          await field.click();
          await field.type(fieldOfStudy, { delay: delayNum() });

          const degreeSecBtn = await continueButtonFunc("Save");
          await degreeSecBtn.click();

          const doneButton = await page.waitForXPath(addToProfileSel("Done"));
          await doneButton.click();
          break;
        }
        case "EXPERIENCE": {
          console.log("experience");
          // Step 1
          if (!company) {
            company = " ";
          }
          const companyInput = await page.waitForXPath(placeholderSelector);
          await companyInput.click();
          await companyInput.type(company, { delay: delayNum() });

          const experienceBtn = await continueButtonFunc("Continue");
          await experienceBtn.click();

          // Step 2
          if (!title) {
            title = " ";
          }
          await page.waitForXPath(textSelector("Title"));
          const titleInput = await page.waitForXPath(placeholderSelector);
          await titleInput.click();
          await titleInput.type(title, { delay: delayNum() });

          const btn = await continueButtonFunc("Continue");
          await btn.click();

          // Step 3

          await page.waitForXPath(textSelector("Start Date"));

          if (positionExperience) {
            let positionClean = positionExperience.split(" ");
            if (positionClean[1] === "–") {
              // If we haven't got a month in our date data
              await page.select(
                positionStartMonth,
                randomFromOneToTen.toString()
              );
              await page.select(
                positionStartYear,
                (2007 + randomFromOneToTen).toString()
              );
            } else {
              let positionStMonth = moment()
                .month(positionClean[0])
                .format("M");
              await page.select(positionStartMonth, positionStMonth.toString());
              await page.select(positionStartYear, positionClean[1].toString());
            }
          } else {
            await page.select(
              positionStartMonth,
              randomFromOneToTen.toString()
            );
            await page.select(
              positionStartYear,
              (2007 + randomFromOneToTen).toString()
            );
          }

          const checkbox = await page.waitForSelector(industryCheckboxSelector);
          await checkbox.click().catch(() => console.log(`Already checked`));
          await page.select(positionIndustry, internetIndustry);

          const addToProfileBtn = await continueButtonFunc("Add to profile");
          await addToProfileBtn.click();

          // Step 4
          if (!city) {
            city = " ";
          }
          await page.waitForXPath(textSelector("Region"));
          const regionInput = await page.waitForXPath(placeholderSelector);
          await regionInput.click();
          await regionInput.type(city, { delay: delayNum() });

          const saveBtn = await continueButtonFunc("Save");
          await saveBtn.click();

          // Step 5
          const doneButton = await page.waitForXPath(addToProfileSel("Done"));
          await doneButton.click();

          break;
        }
        case "WORK_DATES": {
          console.log("Work dates");
          await page.waitForXPath(textSelector("Start Date"));
          if (positionExperience) {
            let workDatesClean = positionExperience.split(" ");
            let workDatesStMonth = moment()
              .month(workDatesClean[0])
              .format("M");
            await page.select(positionStartMonth, workDatesStMonth.toString());
            await page.select(positionStartYear, workDatesClean[1].toString());
          } else {
            await page.select(
              positionStartMonth,
              randomFromOneToTen.toString()
            );
            await page.select(
              positionStartYear,
              (2007 + randomFromOneToTen).toString()
            );
          }

          //Element is visually hidden that's why we are evaluating
          await page.evaluate(sel => {
            const checkbox = document.evaluate(
              sel,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;
            if (checkbox) {
              checkbox.click();
            }
          }, currentWorkSelector);

          const checkbox = await page.waitForSelector(industryCheckboxSelector);
          await checkbox.click();

          await page.select(positionIndustry, internetIndustry);

          const addToProfileBtn = await continueButtonFunc("Add to profile");
          await addToProfileBtn.click();

          const workDatesDone = await page.waitForXPath(
            addToProfileSel("Done")
          );
          await workDatesDone.click();

          break;
        }
        case "SKILLS": {
          console.log("skills");
          const inputSkills = await page
            .waitForXPath("//input[@placeholder = 'Skill (ex: Data Analysis)']")
            .catch(() => console.log(`${errorElement} skills' options`));
          // If we have not enough skills options than choose default
          if (inputSkills) {
            console.log("Input case");
            for (let i in skillsOpt) {
              const addAnotherSkillBtn = await page
                .waitForXPath(addAnotherSkillSel, { timeout: waitingTime })
                .catch(() => console.log(`${errorElement} add skill button`));
              if (addAnotherSkillBtn) {
                await addAnotherSkillBtn.click();
              }

              const inputs = await page
                .waitForXPath(
                  "//input[@placeholder = 'Skill (ex: Data Analysis)']"
                )
                .catch(() => console.log(`${errorElement} skills' options`));
              await inputs.click();
              await inputs.type(skillsOpt[i], { delay: delayNum() });
              await page.keyboard.press("Enter");
            }
          } else {
            for (let i in skillsOpt) {
              if (i !== skillsOpt.length - 1) {
                const addAnotherSkillBtn = await page.waitForXPath(
                  addAnotherSkillSel
                );
                await addAnotherSkillBtn.click();
                const skillsInput = await page.waitForXPath(
                  skillsInputSelector
                );
                await skillsInput.click();
                await skillsInput.type(skillsOpt[i], { delay: delayNum() });
                await page.keyboard.press("Enter");
              }
            }
          }

          const skillButton = await page.waitFor(
            addToProfileSel("Add to profile")
          );
          await skillButton.click();

          const skillSecButton = await page.waitForXPath(
            addToProfileSel("Done")
          );
          await skillSecButton.click();

          break;
        }
        case "SUMMARY": {
          console.log("summary");
          const textarea = await page.waitForXPath(textareaSelector);
          await textarea.click();
          // await textarea.type(summary, { delay: delayNum() });
          await page.evaluate(
            args => {
              return (document.evaluate(
                args[0],
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              ).singleNodeValue.value = args[1]);
            },
            [textareaSelector, summary]
          );

          await page.keyboard.press("Enter");
          const summaryButton = await page.waitForXPath(
            addToProfileSel("Add to profile")
          );
          await page.waitFor(waitingTime);
          await summaryButton.click();
          break;
        }
        case "PHOTO":
          console.log("photo");

          const uploadPhoto = await page
            .waitForXPath('//*[@id = "image-selector__file-upload-input"]', {
              timeout: waitingTime
            })
            .catch(() => console.log("not a file input"));
          if (uploadPhoto) {
            await uploadPhoto.uploadFile(avatar);
            const avatarError = await page
              .waitForXPath("//*[contains(@class, 'artdeco-toast-inner')]", {
                timeout: waitingTime
              })
              .catch(() => console.log("no need for default photo"));
            if (avatarError) {
              console.log("avatar error");

              // error case photo
              avatar = defaultAvatar;
            }
            await page.waitFor(timeout / 3);
            const saveImage = await page.waitForXPath(
              textSelector("Save photo")
            );
            await saveImage.click();
            await page.waitFor(timeout / 3);
          }
          break;
        default:
          console.log("Error from switch case");
      }
      const newLevelNotif = await page
        .waitForXPath(addToProfileSel("Got it"), {
          timeout: waitingTime
        })
        .catch(() => console.log("There isn't any notification"));

      if (newLevelNotif) {
        await newLevelNotif.click();
      }
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
    }

    //////////////

    // Main function
    main = await extLoginFunc.signIn(
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

    if (main[0] !== "restricted") {
      console.log("not a string");
      page = main[0];
      browser = main[1];

      //Enter to personal profile page
      await page.waitFor(waitingTime);
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
      const emailConfirmation = await page
        .waitForXPath(emailConfirmationSelector, { timeout: waitingTime })
        .catch(() => console.log("no need to confirm an email"));
      if (emailConfirmation) {
        // We need to confirm an email
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
          waitUntil: "domcontentloaded"
        });
      }
      const meBtn = await page.waitForXPath(profileButtonSelector);
      await meBtn.click();

      await page.waitFor(shortWaitingTime);
      const viewProfile = await page.waitForXPath(viewProfileSelector);
      await viewProfile.click();

      await page.waitFor(waitingTime);
      await check();

      //  In the end change location if needed
      if (!locationChanged) {
        console.log("changing location");
        const penIcon = await page.waitForXPath(penIconSelector);
        await penIcon.click();
        await page.waitFor(waitingTime);

        // await page.select(locationSelector, location);
        const inputZIP = await page.waitForXPath(zipCodeSelector);
        await inputZIP.click({ clickCount: 3 });
        await inputZIP.type(zip, { delay: delayNum() });
        await page.waitFor(waitingTime / 2);
        const locationBtn = await page.$x("//button[text() = 'Save']");
        await locationBtn[1].click();
      }

      await axios
        .post(
          `${domain}/api/core/common/account/${job.id}/event/`,
          JSON.stringify({
            data: {
              eventType: "filled"
            }
          })
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    } else {
      console.log("yes, it's string");
      browser = main[1];
      await axios
        .post(
          `${domain}/api/core/common/account/${job.id}/event/`,
          JSON.stringify({
            data: {
              eventType: "account_blocked"
            }
          })
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  } catch (err) {
    throw err;
  } finally {
    await browser.close();

    // Delete avatar images
    fs.unlinkSync(pathAvatar, err => {
      console.log(err);
    });
    fs.unlinkSync(pathDefaultAvatar, err => {
      console.log(err);
    });

    await axios
      .post(`${domain}/api/core/common/job/${job.id}/end/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
};
