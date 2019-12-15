const axios = require("axios");
const moment = require("moment");
const domain = require("./domain").domain;

module.exports.parseData = async function parseData(page) {
  const waitingTime = 3000;
  const errorElement = "Can't find";

  const selector = value =>
    `//*[contains(@class, "pv-top-card-section__${value}")]`;
  const showMoreSelector = '//*[text() = "Show more"]';
  const showMoreSkillsSelector =
    '//*[contains(@class, "pv-skills-section__additional-skills")]';
  const skillsSelector =
    '//*[text() = "Skills & Endorsements"]/following-sibling::ol//li[contains(@class, "pv-skill-category-entity__top-skill")]';
  const secSkillsSelector =
    '//li[contains(@class, "pv-skill-category-entity--secondary")]';
  const classSelector = value => `//*[contains(@class, "${value}")]`;
  const interestSelector = '//h3[contains(@class, "summary-title")]';
  const degreeSelector = '//*[@class = "pv-entity__degree-info"]';
  const textSelector = value => `//*[contains(text(), '${value}')]`;

  const getTextFunc = async (value, page) => {
    return await page
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
        { timeout: waitingTime },
        value
      )
      .then(el => el._remoteObject.value)
      .catch(() => console.log("job title catch"));
  };

  try {
    let url = await page.url();
    url = url.split("https://www.linkedin.com/in/")[1];
    const linkedin_id = url.slice(0, url.length - 1);

    const showMore = await page
      .waitForXPath(showMoreSelector, { timeout: waitingTime })
      .catch(() => console.log(`${errorElement} show more button`));
    if (showMore) {
      await showMore.click();
    }

    // Grab photo
    const photoUrl = await page.evaluate(sel => {
      const element = document.evaluate(
        sel,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      let url = element.style.backgroundImage;
      url = url.slice(5, -2);
      return url;
    }, classSelector("entity__image"));

    const status = await axios({
      url: photoUrl,
      responseType: "stream"
    })
      .then(response => {
        response.data.pipe(
          fs.createWriteStream(
            `${process.cwd()}/assets/${moment().format()}.jpg`
          )
        );

        return { status: true, error: "" };
      })
      .catch(error => ({ status: false, error: "Error: " + error.message }));

    console.log("image status: ", status);
    // Number of connections

    await page.waitFor(waitingTime * 2);
    let numConnect = await getTextFunc(
      classSelector("section__connections"),
      page
    );
    let position = numConnect.indexOf("+");
    if (position !== -1) {
      numConnect = numConnect.slice(position - 3, position);
    } else {
      numConnect = numConnect.split(" ");
      if (numConnect[0] === "See") {
        numConnect = numConnect[2].slice(1, 4);
      } else {
        numConnect = numConnect[0];
      }
    }
    console.log("Number of connections", numConnect);
    // Summary
    let summary = await getTextFunc(selector("summary-text"), page);
    console.log("summary", summary);

    if (!summary) {
      summary = "";
    }

    let location = await getTextFunc(classSelector("section__location"), page);
    console.log("location: ", location);

    if (!location) {
      location = "";
    }

    // Experience
    const showMoreExperience = await page
      .waitForXPath(textSelector("more experience"), { timeout: waitingTime })
      .catch(() => console.log(`${errorElement} more experience button`));
    if (showMoreExperience) {
      await showMoreExperience.click();
    }
    let experience = await page
      .evaluate(sel => {
        const result = [];
        const experience = [];
        let position, company, location, duration;
        const elements = document.evaluate(
          sel,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (let i = 0, length = elements.snapshotLength; i < length; i++) {
          result.push(elements.snapshotItem(i).innerText);
        }
        for (let i = 0; i < result.length; i++) {
          let text = result[i].split("\n");
          position = text[text.indexOf("Title") + 1];
          company = text[text.indexOf("Company Name") + 1];
          location =
            text.indexOf("Location") === -1
              ? ""
              : text[text.indexOf("Location") + 1];
          duration = text[text.indexOf("Dates Employed") + 1];
          experience.push({ position, company, location, duration });
        }
        return experience;
      }, classSelector("pv-position-entity"))
      .catch(() => console.log(`${errorElement} education`));
    console.log("experience", experience);

    if (!experience) {
      experience = [];
    }
    // Education
    const showMoreEducation = await page
      .waitForXPath(textSelector("more education"), { timeout: waitingTime })
      .catch(() => console.log(`${errorElement} more experience button`));
    if (showMoreEducation) {
      await showMoreEducation.click();
    }

    let education = await page
      .evaluate(
        (sel, sel2) => {
          const result = [];
          const dates = [];
          const education = [];
          const elements = document.evaluate(
            sel,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
          const elements2 = document.evaluate(
            sel2,
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          );
          for (let i = 0, length = elements.snapshotLength; i < length; i++) {
            result.push(elements.snapshotItem(i).innerText);
          }
          for (let i = 0, length = elements2.snapshotLength; i < length; i++) {
            dates.push(elements2.snapshotItem(i).innerText);
          }
          for (let i = 0; i < result.length; i++) {
            let edu = result[i].split("\n");
            let date = dates[i].split("\n");
            education.push({
              university: edu[0],
              degree: edu[3],
              field: edu[6],
              dates: date[1]
            });
          }
          return education;
        },
        degreeSelector,
        classSelector("pv-entity__dates")
      )
      .catch(() => console.log(`${errorElement} education`));
    console.log("education", education);

    if (!education) {
      education = [];
    }
    // Scroll
    await page
      .waitForFunction(
        () => {
          return window.scrollBy(0, window.innerHeight);
        },
        { timeout: waitingTime }
      )
      .catch(() => console.log("scrolled"));

    // Skills
    const showMoreSkills = await page
      .waitForXPath(showMoreSkillsSelector, { timeout: waitingTime })
      .catch(() => console.log(`${errorElement} "show more" skills button`));
    if (showMoreSkills) {
      await showMoreSkills.click();
    }
    let skills = await page.evaluate(
      (sel, sel2) => {
        const skills = [];
        const results = [];
        const element = document.evaluate(
          sel,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        const element2 = document.evaluate(
          sel2,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        for (let a = 0, length = element.snapshotLength; a < length; ++a) {
          results.push(element.snapshotItem(a).innerText);
        }
        if (element2) {
          for (let a = 0, length = element2.snapshotLength; a < length; ++a) {
            results.push(element2.snapshotItem(a).innerText);
          }
        }
        for (let i = 0; i < results.length; i++) {
          let text = results[i].split("\n");
          skills.push(text[0]);
        }

        return skills;
      },
      skillsSelector,
      secSkillsSelector
    );

    if (!skills) {
      skills = [];
    } else {
      for (let i in skills) {
        if (skills[i].indexOf(" for skill: ") !== -1) {
          skills[i] = skills[i].slice(skills[i].indexOf(" for skill: ") + 12);
        }
      }
    }

    console.log("skills", skills);
    // Interests
    let interests = await page.evaluate(sel => {
      const list = [];
      const elements = document.evaluate(
        sel,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (elements) {
        for (let a = 0, length = elements.snapshotLength; a < length; ++a) {
          list.push(elements.snapshotItem(a).innerText);
        }
        return list;
      }
    }, interestSelector);
    console.log("interests", interests);
    if (!interests) {
      interests = [];
    }

    const json_data = {
      data: {
        number: numConnect,
        summary,
        location,
        experience,
        education,
        skills,
        interests,
        linkedin_id
      }
    };

    await axios
      .post(`${domain}/api/add-parsed-data`, JSON.stringify(json_data))
      .catch(() => console.log("err"));

    await page.waitFor(waitingTime * 2);
  } catch (err) {
    throw err;
  } finally {
    console.log("end of parse data");
    return page;
  }
};
