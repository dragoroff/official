const extLoginFunc = require("../helpers/SignIn");
const axios = require("axios");
const domain = require("../helpers/domain").domain;

module.exports.parser = async function parser(job) {
    const emailGmail = job.account.gmail.email;
    const password = job.account.gmail.password;
    const recoveryEmail = job.account.gmail.recovery_email;
    const firstNameValue = job.account.profile_details["first_name"];
    const passwordLinkedIn = job.account.li_password;
    const phoneNumber = job.account.gmail.phone;
    const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
    let cookies = job.account.li_cookies;

    const randomName = job.data["search_name"];
    const randomLocation = job.data["search_location"];
    let totalCount = job.data["number_pages"];

    let delayNum = () => {
        return Math.ceil(Math.random() * 100 + 100);
    };

    const waitingTime = 3000;
    const errorElement = "Can't find";

    const profileSelector = '//*[contains(@class, "search-result__result-link")]';
    const clearSelector = '//span[contains(text(), "Clear")]';
    const allFiltersSelector = '//*[text() = "All Filters"]';
    const inputSelector = value => `//input[@placeholder = "${value}"]`;
    const applyBtnSelector =
        '//button[contains(@class, "search-advanced-facets__button--apply")]';
    const clearButtonSelector = '//*[text() = "Clear "]//span';
    const degreeSelector = '//*[@class = "pv-entity__degree-info"]';
    const datesSelector = '//*[contains(@class, "pv-entity__dates")]';
    const notNowSelector = '//span[text() = "Not now"]';
    const buttonSelector = value => `//*[text() = "${value}"]`;
    const submitClassSelector = '//button[contains(@class, "button-primary")]';
    const dismissInfoboxSelector = '//*[@aria-label = "Dismiss"]';
    const suggestionSel = '//*[contains(@class, "triggered-content")]';

    let currentPage = 1;
    try {
        main = await extLoginFunc.signIn(
            emailGmail,
            password,
            recoveryEmail,
            passwordLinkedIn,
            phoneNumber,
            firstNameValue,
            proxy,
            cookies,
            job.id
        );

        if (main[0] === "restricted" || main[0] === "robot") {
            console.log("Account restricted");
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
        } else {
            page = main[0];
            browser = main[1];

            await page.waitFor(waitingTime);
            await page.keyboard.press("Escape");
            await page.keyboard.press("Escape");
            const notNow = await page
                .waitForXPath(notNowSelector, {timeout: waitingTime})
                .catch(() => console.log("not skipped"));
            if (notNow) {
                await notNow.click();
            }

            // Check notifications and messages

            const notifications = await page.waitForXPath(
                buttonSelector("Notifications")
            );
            await notifications.click();
            await page.waitFor(waitingTime * 2);

            const messages = await page.waitForXPath(buttonSelector("Messaging"));
            await messages.click();
            const submBtn = await page
                .waitForXPath(submitClassSelector, {timeout: waitingTime})
                .catch(() => console.log(`${errorElement} button`));

            if (submBtn) {
                await submBtn.click();
            }

            const gotItBtn = await page
                .waitForXPath(buttonSelector("Got it"), {timeout: waitingTime})
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
                .waitForXPath(dismissInfoboxSelector, {timeout: waitingTime})
                .catch(() => console.log("No need to dismiss"));

            if (dismissInfobox) {
                await dismissInfobox.click();
            }
            // Come back to home page
            const home = await page.waitForXPath(buttonSelector("Home"));
            await home.click();
            await page.waitFor(waitingTime);

            // Go to search results
            const search = await page.waitForXPath(inputSelector("Search"));
            await search.click();
            await search.type(randomName, {delay: delayNum()});
            await page.keyboard.press("Enter");

            // Choose location
            const clear = await page
                .waitForXPath(clearSelector, {timeout: waitingTime})
                .catch(() => console.log(`${errorElement} clear button`));

            if (clear) {
                await clear.click();
            }

            const allFilters = await page.waitForXPath(allFiltersSelector);
            await allFilters.click();

            const locInput = await page.waitForXPath(inputSelector("Add a country/region"));
            await locInput.click();
            await locInput.type(randomLocation, {delay: delayNum()});

            await page.waitFor(waitingTime);
            const suggestions = await page
                .$x(suggestionSel, {timeout: waitingTime * 2})
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
            if (clearItems === "1") {
                const applyButton = await page
                    .waitForXPath(applyBtnSelector)
                    .catch(() => console.log(`${errorElement} apply button`));
                console.log("found a button");
                await applyButton.click();
            } else {
                console.log("Something went wrong: Can't find Clear Button");
                await browser.close();
            }

            const url = await page.url();
            if (url === "https://www.linkedin.com/search/results/all/") {
                console.log("Something went wrong");
                await browser.close();
            }

            // Scroll down
            await page
                .waitForFunction(
                    () => {
                        return window.scrollBy(0, window.innerHeight);
                    },
                    {timeout: waitingTime}
                )
                .catch(() => console.log("scrolled"));

            const listOfProfiles = await page.$x(profileSelector);
            let index = 0;
            for (let i = 0; i < totalCount; i++) {
                console.log("start");
                await page.waitFor(waitingTime);
                const link = await page
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
                            for (
                                let a = 0, length = element.snapshotLength;
                                a < length;
                                a += 2
                            ) {
                                results.push(element.snapshotItem(a));
                            }
                            return results[args[1]].href;
                        },
                        {timeout: waitingTime * 2},
                        [profileSelector, index]
                    )
                    .catch(() => console.log("Seeking for link"));

                index++;
                console.log(index);
                const currentURL = await page.url();
                console.log("current url: ", currentURL);
                totalCount = await parseData(
                    browser,
                    totalCount,
                    link._remoteObject.value,
                    currentURL
                );

                if (listOfProfiles.length / 2 === index + 1) {
                    const changePage = await page.waitForXPath(
                        `//*[text() = "${currentPage + 1}"]`
                    );
                    await changePage.click();
                    currentPage++;
                    await page.waitFor(waitingTime * 3);
                    console.log("change page");
                    index = 0;
                }
                console.log("i", i);
                console.log("totalCount", totalCount);
            }

            async function parseData(browser, totalCount, link, url) {
                const selector = value => `//*[contains(@class, "${value}")]`;
                const showMoreSelector = '//*[text() = "Show more"]';
                const showMoreSkillsSelector =
                    '//*[contains(@class, "pv-skills-section__additional-skills")]';
                const skillsSelector =
                    '//*[text() = "Skills & Endorsements"]/following-sibling::ol//li[contains(@class, "pv-skill-category-entity__top-skill")]';
                const secSkillsSelector =
                    '//li[contains(@class, "pv-skill-category-entity--secondary")]';
                const experienceSelector =
                    '//*[contains(@class, "pv-position-entity")]';

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
                            {timeout: waitingTime},
                            value
                        )
                        .then(el => el._remoteObject.value)
                        .catch(() => console.log("job title catch"));
                };

                try {
                    const parsePage = await browser.newPage();
                    await parsePage.goto(link, {
                        waitUntil: "domcontentloaded",
                        referer: url
                    });
                    const showMore = await parsePage
                        .waitForXPath(showMoreSelector, {timeout: waitingTime})
                        .catch(() => console.log(`${errorElement} show more button`));
                    if (showMore) {
                        await showMore.click();
                    }

                    // Summary
                    let summary = await getTextFunc(selector("summary-text"), parsePage);
                    console.log("summary", summary);
                    if (!summary || summary.length === 0) {
                        console.log("no summary specified");
                        await parsePage.close();
                        await parsePage.waitFor(waitingTime);
                        totalCount++;
                        throw "Is empty";
                    }

                    // Experience
                    const experience = await parsePage
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
                            for (
                                let i = 0, length = elements.snapshotLength;
                                i < length;
                                i++
                            ) {
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
                                experience.push({position, company, location, duration});
                            }
                            return experience;
                        }, experienceSelector)
                        .catch(() => console.log(`${errorElement} education`));
                    console.log("experience", experience);

                    if (!experience || experience.length === 0) {
                        console.log("no experience specified");
                        await parsePage.close();
                        await parsePage.waitFor(waitingTime);
                        totalCount++;
                        throw "Is empty";
                    }
                    // Education
                    const education = await parsePage
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
                                for (
                                    let i = 0, length = elements.snapshotLength;
                                    i < length;
                                    i++
                                ) {
                                    result.push(elements.snapshotItem(i).innerText);
                                }
                                for (
                                    let i = 0, length = elements2.snapshotLength;
                                    i < length;
                                    i++
                                ) {
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
                            datesSelector
                        )
                        .catch(() => console.log(`${errorElement} education`));
                    console.log("education", education);

                    if (!education || education.length === 0) {
                        console.log("no education specified");
                        await parsePage.close();
                        await parsePage.waitFor(waitingTime);
                        totalCount++;
                        throw "Is empty";
                    }
                    // Scroll
                    await parsePage
                        .waitForFunction(
                            () => {
                                return window.scrollBy(0, window.innerHeight);
                            },
                            {timeout: waitingTime}
                        )
                        .catch(() => console.log("scrolled"));

                    // Skills
                    const showMoreSkills = await parsePage
                        .waitForXPath(showMoreSkillsSelector, {timeout: waitingTime})
                        .catch(() =>
                            console.log(`${errorElement} "show more" skills button`)
                        );
                    if (showMoreSkills) {
                        await showMoreSkills.click();
                    }
                    const skills = await parsePage.evaluate(
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
                            for (
                                let a = 0, length = element.snapshotLength;
                                a < length;
                                ++a
                            ) {
                                results.push(element.snapshotItem(a).innerText);
                            }
                            if (element2) {
                                for (
                                    let a = 0, length = element2.snapshotLength;
                                    a < length;
                                    ++a
                                ) {
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
                    console.log("skills", skills);
                    if (!skills || skills.length === 0) {
                        console.log("no skills specified");
                        await parsePage.close();
                        await parsePage.waitFor(waitingTime);
                        totalCount++;
                        throw new Error("Is empty");
                    }

                    const json_data = {
                        results: {
                            experience,
                            education,
                            skills,
                            summary,
                            type: "DATA"
                        }
                    };

                    await axios
                        .post(
                            `${domain}/api/core/crawler/profile/`,
                            JSON.stringify(json_data)
                        )
                        .catch(err => console.log(err));

                    await parsePage.close();
                    await parsePage.waitFor(waitingTime * 2);
                } catch (err) {
                    throw err;
                } finally {
                    return totalCount;
                }
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        console.log("end");
        await browser.close();
        await axios
            .post(`${domain}/api/core/common/job/${job.id}/end/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
};
