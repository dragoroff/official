const extLoginFunc = require("../helpers/SignIn");
const axios = require("axios");
const changePage = require("../helpers/changePage").changePage;
const domain = require("../helpers/domain").domain;
const emailBuilder = require("../helpers/emailBuilder");
const utils = require("../utils/utils");

const waitingTime = 3000;
const timeout = 30000;
const polling = 2000;

const errorElement = "Can't find";
const delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
};


const TARGET_PEOPLE = "People",
    TARGET_COMPANY = "Companies",
    TARGET_GROUP = "Groups";

const CAMPAIGN_TYPE_COMPANY = "COMPANY";
const MANAGER_READY = "MANAGER_READY",
    MANAGER_IN_PROGRESS = "MANAGER_IN_PROGRESS",
    MANAGER_DONE = "MANAGER_DONE",
    WORKER_IN_PROGRESS = "WORKER_IN_PROGRESS",
    WORKER_DONE = "WORKER_DONE";

const MAIL_BUILDER_TYPE_CONDITIONAL = "CONDITIONAL",
    MAIL_BUILDER_TYPE_FORCE = "FORCE";

const NEXT_ELEMENT_TEXT = "NextElementText",
    ELEMENT_TEXT = "ElementText",
    CHILD_TEXT = "ChildText",
    LAST_CHILD_TEXT = "LastChildText",
    ELEMENT = "Element",
    CHILD_ELEMENT = "ChildElement";


const elementSelector = async (value, status, profilePage) => {
    const selector = value;
    let text, element;
    switch (status) {
        case ELEMENT: {
            element = await profilePage.waitForFunction(sel => {
                const el = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null).singleNodeValue;
                if (el) {
                    return el;
                }
            }, {
                timeout: timeout / 2
            }, selector);
            return element;
        }
        case CHILD_ELEMENT: {
            element = await profilePage.waitForFunction(sel => {
                const el = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null).singleNodeValue.firstElementChild;
                if (el) {
                    return el;
                }
            }, {
                timeout: timeout / 2
            }, selector);
            return element;
        }
        case NEXT_ELEMENT_TEXT: {
            text = await profilePage.evaluate(sel => {
                const element = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue.nextElementSibling;
                if (element) {
                    return element.innerText;
                }
            }, selector);
            return text;
        }
        case ELEMENT_TEXT: {
            text = await profilePage.evaluate(sel => {
                const element = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                if (element) {
                    return element.innerText;
                }
            }, selector);
            return text;
        }
        case CHILD_TEXT: {
            text = await profilePage.evaluate(sel => {
                const element = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue.firstElementChild;
                if (element) {
                    return element.innerText;
                }
            }, selector);
            return text;
        }
        case LAST_CHILD_TEXT: {
            text = await profilePage.evaluate(sel => {
                const element = document.evaluate(
                    sel,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue.lastElementChild;
                if (element) {
                    return element.innerText;
                }
            }, selector);
            return text;
        }
    }
};

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
            {timeout: waitingTime * 2},
            [selector, index]
        )
        .catch(() => console.log("Seeking for link"));

const objectSelector = async (selector, index, status, page) =>
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
                // Don't change values
                if (args[2] === "Parent") {
                    return results[args[1]].parentElement.nextElementSibling.innerText;
                }
                if (args[2] === "Element") {
                    return results[args[1]].innerText;
                }
            },
            {timeout: waitingTime * 2},
            [selector, index, status]
        )
        .catch(() => console.log("Seeking for link"));


module.exports.parser = async function parser(job) {
    console.log(job);
    let target_page, limit;
    const target = [];
    const status = job.data.status;
    const mail_builder = job.data.mail_builder;
    const campaign_type = job.data.campaign_type;
    let white_list = job.data.white_list;
    const keyword = job.data.keyword;

    if (white_list) {
        white_list = white_list.split(",").map(x => x.toLowerCase().trim());
    }

    console.log("WHITE LIST", white_list);
    if (status === MANAGER_READY) {
        target_page = 1;
        limit = 1 * 10;
        if (job.data.get_people) {
            target.push(TARGET_PEOPLE);
        }
        if (job.data.get_groups) {
            target.push(TARGET_GROUP);
        }
        if (job.data.get_companies) {
            target.push(TARGET_COMPANY);
        }
    } else {
        limit = job.data.limit * 10;
        target_page = job.data.page_num;
        target_page = parseInt(target_page);
        target.push(job.data.target);
    }

    const emailGmail = job.account.gmail.email;
    const password = job.account.gmail.password;
    const recoveryEmail = job.account.gmail.recovery_email;
    const firstNameValue = job.account.profile_details.first_name;
    const passwordLinkedIn = job.account.li_password;
    const phoneNumber = job.account.gmail.phone;
    const proxy = `${job.account.proxy.ip}:${job.account.proxy.port}`;
    let cookies = job.account.li_cookies;
    const job_id = job.id;


    const profileSelector = '//*[contains(@class, "search-result__title")]';
    const positionSelector = '//*[contains(@class, "subline-level-1 t-14 t-black t-normal search-result__truncate")]';
    const inputSelector = '//input[contains(@placeholder, "Search")]';
    const moreButSelector = '//span[text() = "More"]';
    const buttonSelector = value => `//*[text() = "${value}"]`;
    const dismissInfoboxSelector = '//*[@aria-label = "Dismiss"]';
    const submitClassSelector = '//button[contains(@class, "button-primary")]';
    const paginationSelector = '//li[contains(@class, "pagination")]';
    const searchInputSel = '//*[@class = "nav-search-bar"]';

    try {
        if (status === MANAGER_READY) {
            await axios
                .post(
                    `${domain}/api/core/campaign/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: MANAGER_IN_PROGRESS
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        } else {
            await axios
                .post(
                    `${domain}/api/core/campaign/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: WORKER_IN_PROGRESS
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        }

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

        page = main[0];
        browser = main[1];

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
        const search = await page
            .waitForXPath(inputSelector, {timeout: waitingTime})
            .catch(() => console.log(`${errorElement} searcher input`));
        if (!search) {
            const searchInput = await page.waitForXPath(searchInputSel);
            await searchInput.click();
            await searchInput.type(`${keyword}`, {delay: delayNum()});
        } else {
            await search.click({clickCount: 3});
            await search.type(`${keyword}`, {delay: delayNum()});
        }

        await page.keyboard.press("Enter");
        await page.waitFor(waitingTime * 2);

        for (let i = 0; i < target.length; i++) {
            let moreButton = await page
                .waitForXPath(moreButSelector, {timeout: waitingTime})
                .catch(() => console.log(`${errorElement} more button`));

            if (moreButton) {
                await moreButton.click();
            }
            // if we just started but couldn't find more button
            else if (i === 0) {
                const selector = await page.waitForXPath(
                    buttonSelector(`${target[i]}`)
                );
                await selector.click();
            }
            // Find name of previous entity to switch to the new one
            else {
                const entitySelector = await page.waitForXPath(
                    buttonSelector(`${target[i - 1]}`)
                );
                await entitySelector.click();
            }

            await page.waitFor(waitingTime * 2);

            const companiesFilt = await page.waitForXPath(
                buttonSelector(`${target[i]}`)
            );

            await companiesFilt.click();
            console.log(`${target[i]} click`);

            await page.waitFor(waitingTime);
            // Scroll down
            await page
                .waitForFunction(
                    () => {
                        return window.scrollBy(0, window.innerHeight);
                    },
                    {timeout: waitingTime}
                )
                .catch(() => console.log("scrolled"));

            if (status === MANAGER_READY) {
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
                    .catch(() => console.log(`${errorElement} pagination`));

                if (!numPage) {
                    console.log("There aren't any results for this keyword");
                } else {
                    if (parseInt(numPage) > limit / 10) {
                        await axios
                            .post(
                                `${domain}/api/core/campaign/crawler/${job_id}/worker-job/`,
                                JSON.stringify({
                                    target: target[i],
                                    mail_builder: mail_builder,
                                    total_pages: parseInt(numPage) - limit / 10
                                })
                            )
                            .then(() => console.log("Success"))
                            .catch(() => console.log("Failed"));
                    }
                }
            } else {
                const url = await page.url();
                const targetPageURL = `${url}&page=${target_page}`;
                await page.goto(targetPageURL, {
                    waitUntil: "domcontentloaded",
                    referer: url
                });
                await page.waitFor(waitingTime * 2);

                // Scroll down
                await page
                    .waitForFunction(
                        () => {
                            return window.scrollBy(0, window.innerHeight);
                        },
                        {timeout: waitingTime}
                    )
                    .catch(() => console.log("scrolled"));
            }
            // Check how many pages do you have in total
            const pagination = await page
                .$x(paginationSelector)
                .catch(() => console.log(`${errorElement} pagination`));

            let lastPage;
            if (pagination.length > 0) {
                lastPage = await objectSelector(
                    paginationSelector,
                    pagination.length - 1,
                    ELEMENT,
                    page
                );
                lastPage = lastPage._remoteObject.value;
            } else {
                lastPage = 0;
            }


            let runningLimit = limit;
            let count = target_page;
            // Parse info from companies
            const listOfProfiles = await page.$x(profileSelector);
            for (let x = 0; x < runningLimit; x++) {
                // Check current URL
                const currentUrl = await page.url();
                console.log("current url", currentUrl);
                if (!currentUrl.includes("/search/results/")) {
                    await page.goBack({
                        timeout: waitingTime * 3,
                        waitUntil: "domcontentloaded"
                    });
                    await page.waitFor(waitingTime * 4);
                    count = await changePage(count, page);
                }
                console.log("len", listOfProfiles.length);
                console.log(x);
                console.log("limit", runningLimit);
                if (x < listOfProfiles.length) {
                    console.log(`inside ${target[i]}`);

                    // Check if employee's position are in the white list
                    let emplPosition = await objectSelector(
                        positionSelector,
                        x,
                        ELEMENT,
                        page
                    );

                    console.log("POSITION", emplPosition._remoteObject.value.toLowerCase());
                    emplPosition = emplPosition._remoteObject.value.toLowerCase();
                    if (emplPosition && target[i] === TARGET_PEOPLE && white_list) {
                        for (let i of white_list) {
                            if (emplPosition.includes(i)) {
                                console.log(i);
                                const link = await linkSelector(profileSelector, x).catch(() =>
                                    console.log(`${errorElement} link`)
                                );
                                if (link) {
                                    await parseData(browser, link._remoteObject.value, target[i], mail_builder, job_id, campaign_type, white_list);
                                }
                            }
                        }
                    } else {
                        const link = await linkSelector(profileSelector, x).catch(() =>
                            console.log(`${errorElement} link`)
                        );
                        if (link) {
                            await parseData(browser, link._remoteObject.value, target[i], mail_builder, job_id, campaign_type, white_list);
                        }
                    }
                } else {
                    console.log("change page");
                    count = await changePage(count, page);

                    if (count <= lastPage) {
                        runningLimit -= 10;
                        x = -1;
                    } else {
                        break;
                    }
                }
            }

            if (status === MANAGER_READY) {
                if (target.length - 1 === parseInt(i)) {
                    console.log("inside");
                    await axios
                        .post(
                            `${domain}/api/core/campaign/crawler/${job_id}/status/`,
                            JSON.stringify({
                                status: MANAGER_DONE
                            })
                        )
                        .then(() => console.log("Success Done"))
                        .catch(() => console.log("Failed Done"));
                } else {
                    console.log("Not equal");
                }
            } else {
                await axios
                    .post(
                        `${domain}/api/core/campaign/crawler/${job_id}/status/`,
                        JSON.stringify({
                            status: WORKER_DONE
                        })
                    )
                    .then(() => console.log("Success Done"))
                    .catch(() => console.log("Failed Done"));
            }
            console.log("End");
        }
    } catch (err) {
        throw err;
    } finally {
        console.log("end");
        await browser.close();
        await axios
            .post(`${domain}/api/core/common/job/${job_id}/end/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
};


async function parseData(browser, link, status, mail_builder, job_id, campaign_type, white_list) {
    const textSelector = value => `//*[text() = "${value}"]`;
    const textContainSelector = value =>
        `//span[contains(text(), "${value}")]`;
    const memberSelector = '//span[contains(text(),"member")]';
    const titleSelector = '//h2[contains(@class, "mt1")]';
    const companyNameSel = '//h1[contains(@class, "summary__title")]';
    const groupNameSel = '//h1[contains(@class, "entity__name")]';
    const contactInfoSel = '//*[text() = "Contact info"]';
    const emailSelector = "//section[contains(@class, 'ci-email')]";
    const containsClassSelector = value => `//*[contains(@class, "${value}")]`;

    try {
        const profilePage = await browser.newPage();
        await profilePage.goto(link, {waitUntil: "domcontentloaded"});
        await profilePage.waitFor(waitingTime);

        if (status === TARGET_COMPANY) {
            let companyName = await elementSelector(
                companyNameSel,
                ELEMENT_TEXT,
                profilePage
            );
            console.log(companyName);
            if (!companyName) {
                companyName = "";
            }
            const aboutBtn = await profilePage.waitForXPath(
                textSelector("About")
            );
            await aboutBtn.click();

            await profilePage.waitFor(waitingTime);
            let overview = await elementSelector(
                textSelector("Overview"),
                NEXT_ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} overview`));
            if (!overview) {
                overview = "";
            }
            console.log("overview", overview);
            let website = await elementSelector(
                textSelector("Website"),
                NEXT_ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} website`));

            if (!website) {
                website = "";
            }
            console.log("website", website);

            let headquarters = await elementSelector(
                textSelector("Headquarters"),
                NEXT_ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} headquarters`));
            if (!headquarters) {
                headquarters = "";
            }
            console.log("headquarters", headquarters);

            let founded = await elementSelector(
                textSelector("Founded"),
                NEXT_ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} founded`));

            if (!founded) {
                founded = "";
            }
            console.log("founded", founded);

            let followers = await elementSelector(
                containsClassSelector("follower-count"),
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} followers`));

            if (followers) {
                followers = followers.split("follower")[0].trim();
            } else {
                followers = "";
            }

            console.log("followers", followers);

            let numEmployees = await elementSelector(
                textContainSelector("See all"),
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} number of employees`));
            console.log("numEmployees", numEmployees);
            if (numEmployees) {
                numEmployees = numEmployees
                    .split("employee")[0]
                    .split("See all")[1]
                    .trim();
            } else {
                numEmployees = "";
            }
            console.log(numEmployees);

            if (campaign_type === CAMPAIGN_TYPE_COMPANY) {
                let list_employees = [];
                // The case when we want to grab employees details as well
                const companyPeople = await profilePage.waitForXPath(
                    textSelector("People")
                ).catch(() => console.log(`${errorElement} People`));
                if (companyPeople) {
                    await companyPeople.click();
                }

                await profilePage
                    .waitForFunction(
                        () => {
                            return window.scrollBy(0, window.innerHeight);
                        },
                        {polling: polling, timeout: timeout / 3}
                    )
                    .catch(() => {
                        console.log(timeout / 3 / polling);
                    });

                const employeesCards = await profilePage.$x(containsClassSelector("profile-card__profile-info"))
                    .catch(() => console.log(`${errorElement} employee's cards`));

                if (employeesCards) {
                    for (let i = 0; i < employeesCards.length; i++) {
                        let position = await objectSelector(
                            containsClassSelector("subtitle"),
                            i,
                            ELEMENT,
                            profilePage
                        );
                        console.log("position", position);
                        if (position) {
                            position = position._remoteObject.value.toString();
                            position = position.split("at")[0].toLowerCase().trim();

                            // if this position title is in the white list
                            if (white_list && white_list.map(x => x.includes(position)).some(x => x)) {
                                let name = getEmployeeName(
                                    containsClassSelector("lockup__title"),
                                    i,
                                    profilePage
                                );
                                if (name) {
                                    list_employees.push({
                                        name,
                                        position
                                    })
                                }
                            } else if (!white_list) {
                                let name = getEmployeeName(
                                    containsClassSelector("lockup__title"),
                                    i,
                                    profilePage
                                );
                                if (name) {
                                    list_employees.push({
                                        name,
                                        position
                                    })
                                }
                            }
                        }
                    }
                }

                console.log("EMPLOYEES", list_employees);
                await axios
                    .post(
                        `${domain}/api/core/campaign/crawler/${job_id}/add/`,
                        JSON.stringify({
                            results: {
                                data: {
                                    overview,
                                    website,
                                    headquarters,
                                    founded,
                                    followers,
                                    numEmployees,
                                    companyName,
                                    employees: list_employees,
                                },
                                type: "COMPANIES"
                            }
                        })
                    )
                    .then(() => console.log("Success"))
                    .catch(() => console.log("Failed"));
            } else {
                await axios
                    .post(
                        `${domain}/api/core/campaign/crawler/${job_id}/add/`,
                        JSON.stringify({
                            results: {
                                data: {
                                    overview,
                                    website,
                                    headquarters,
                                    founded,
                                    followers,
                                    numEmployees,
                                    companyName
                                },
                                type: "COMPANIES"
                            }
                        })
                    )
                    .then(() => console.log("Success"))
                    .catch(() => console.log("Failed"));
            }
        } else if (status === TARGET_GROUP) {
            let groupName = await elementSelector(
                groupNameSel,
                ELEMENT_TEXT,
                profilePage
            );
            if (!groupName) {
                groupName = "";
            }
            console.log(groupName);
            let members = await elementSelector(
                memberSelector,
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} members`));

            if (members) {
                members = members.split("member")[0].trim();
                console.log("followers", members);
            } else {
                members = "";
            }
            let aboutGroup = await elementSelector(
                textSelector("About this group"),
                NEXT_ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} about group`));
            if (!aboutGroup) {
                aboutGroup = "";
            }
            console.log("About", aboutGroup);

            await axios
                .post(
                    `${domain}/api/core/campaign/crawler/${job_id}/add/`,
                    JSON.stringify({
                        results: {
                            data: {
                                members,
                                aboutGroup,
                                groupName
                            },
                            type: "GROUPS"
                        }
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        } else if (status === TARGET_PEOPLE) {
            let personName = await elementSelector(
                containsClassSelector("break-words"),
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} person's name`));
            if (!personName) {
                personName = "";
            }

            let [originalEmail, generatedEmail, companyDomain] = ["", "", ""];
            let contactInfo = await profilePage.waitForXPath(contactInfoSel, {timeout: waitingTime})
                .catch(() => console.log(`${errorElement} profile info`));

            if (contactInfo) {
                await contactInfo.click();
                await profilePage.waitFor(waitingTime * 2);
                originalEmail = await elementSelector(
                    emailSelector,
                    LAST_CHILD_TEXT,
                    profilePage
                ).catch(() => console.log(`${errorElement} personal email`));
                if (!originalEmail) {
                    originalEmail = "";
                }
            }

            await profilePage.keyboard.press("Escape");
            await profilePage.waitFor(waitingTime);

            let company = await elementSelector(
                containsClassSelector("experience-list-item"),
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} company`));

            let title = await elementSelector(
                titleSelector,
                ELEMENT_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} title`));

            if (title) {
                if (company) {
                    if (title.includes(`at ${company}`)) {
                        title = title.split(`at ${company}`)[0].trim();
                    } else if (title.includes(`of ${company}`)) {
                        title = title.split(`of ${company}`)[0].trim();
                    }
                }
            } else {
                title = "";
            }

            if (!company) {
                company = "";
            }

            if (personName && company) {
                if (!originalEmail && mail_builder === MAIL_BUILDER_TYPE_CONDITIONAL
                    || mail_builder === MAIL_BUILDER_TYPE_FORCE) {
                    const [firstName, lastName] = getCleanName(personName);
                    const companyElement = await profilePage.$x(containsClassSelector("experience-list-item"), {timeout: waitingTime})
                        .catch(() => console.log(`${errorElement} company element`));

                    if (companyElement) {
                        companyDomain = await getCompanyDomain(profilePage, companyElement[0]);

                        if (companyDomain) {
                            companyDomain = utils.cleanURL(companyDomain);
                            generatedEmail = await emailBuilder.buildEmail(firstName, lastName, companyDomain);
                        }
                    }
                }
            }
            console.log("email", originalEmail);
            console.log("generated_email", generatedEmail);
            console.log("DOMAIN", companyDomain);
            console.log("company", company);
            console.log("title", title);
            console.log("person name", personName);

            let location = await elementSelector(
                containsClassSelector("pv-top-card-v3--list-bullet"),
                CHILD_TEXT,
                profilePage
            ).catch(() => console.log(`${errorElement} location`));

            if (!location) {
                location = "";
            }
            console.log("location", location);

            await axios
                .post(
                    `${domain}/api/core/campaign/crawler/${job_id}/add/`,
                    JSON.stringify({
                        results: {
                            data: {
                                company,
                                title,
                                location,
                                personName,
                                originalEmail,
                                generatedEmail
                            },
                            type: "PEOPLE"
                        }
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        } else {
            console.log("UNDEFINED");
        }
        await profilePage.close();
    } catch (err) {
        throw err;
    }
}

async function getCompanyDomain(page, companyElement) {
    const companyLinkSelector = '//p[contains(@class, "pv-entity__secondary-title")]';
    const companyLinkSelector2 = '//*[@class = "pv-entity__company-summary-info"]';
    const aboutCompanySel = '//*[text() = "About"]';
    const companyDomainSel = '//*[contains(@data-control-name, "website_external_link")]';
    let companyDomain = "";


    await companyElement.click();
    await page.waitFor(waitingTime);
    const companyLink = await elementSelector(companyLinkSelector, ELEMENT, page)
        .catch(() => console.log(`${errorElement} company link`));

    if (companyLink) {
        await companyLink.click();
    } else {
        // Second scenario, when the person worked on different positions in company
        await page.waitFor(waitingTime);
        const companyLink2 = await elementSelector(companyLinkSelector2, CHILD_ELEMENT, page)
            .catch(() => console.log(`${errorElement} company link 2`));

        if (companyLink2) {
            await companyLink2.click();
        } else {
            return companyDomain;
        }
    }

    await page.waitFor(waitingTime * 2);
    const aboutCompanyLink = await page.waitForXPath(aboutCompanySel, {timeout: waitingTime})
        .catch(() => console.log(`${errorElement} about company link`));

    if (aboutCompanyLink) {
        await aboutCompanyLink.click();
    } else {
        return companyDomain;
    }

    await page.waitFor(waitingTime);
    companyDomain = await elementSelector(companyDomainSel, ELEMENT_TEXT, page)
        .catch(() => console.log(`${errorElement} company domain`));
    if (!companyDomain) {
        return "";
    } else {
        return companyDomain;
    }
}


function getCleanName(name) {
    const clean_name = name.replace(/[^a-zA-Z ]/g, "").trim();
    return [clean_name.split(" ")[0], clean_name.split(" ")[1]];
}

async function getEmployeeName(sel, index, page) {
    let name = await objectSelector(
        sel,
        index,
        ELEMENT,
        page
    );
    return name._remoteObject.value;
}