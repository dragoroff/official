const extLoginFunc = require("../helpers/SignIn");
const axios = require("axios");
const changePage = require("../helpers/changePage").changePage;
const domain = require("../helpers/domain").domain;

const waitingTime = 3000;
const timeout = 30000;
const polling = 2000;

const errorElement = "Can't find";
const delayNum = () => {
    return Math.ceil(Math.random() * 100 + 100);
};


const COMPANY = "Companies";
const MANAGER_READY = "MANAGER_READY",
    MANAGER_IN_PROGRESS = "MANAGER_IN_PROGRESS",
    MANAGER_DONE = "MANAGER_DONE",
    WORKER_IN_PROGRESS = "WORKER_IN_PROGRESS",
    WORKER_DONE = "WORKER_DONE";


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

const linkSelector = async (selector, index, page) =>
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
    let target_page, target_page_limit;
    const status = job.data.status;
    let white_list = job.data.positions_white_list;
    const max_people = parseInt(job.data.max_people);
    const max_companies = parseInt(job.data.max_companies);
    const get_people = job.data.get_people;
    const keyword = job.data.keyword;

    let limit = 5;

    if (white_list) {
        white_list = white_list.split(",").map(x => x.toLowerCase().trim());
    }

    if (max_companies) {
        if (max_companies > 50) {
            // pass through first 5 pages - Manager Case
            target_page_limit = max_companies / 10 - limit
        } else if (status === MANAGER_READY) {
            // we have limit but its smaller than 5 first pages
            limit = max_companies / 10
        }
    }

    if (status === MANAGER_READY) {
        // Start from the first page and pass through 50 companies (5 pages)
        target_page = 1;
    } else {
        target_page = parseInt(job.data.page_num);
    }

    console.log("WHITE LIST", white_list);


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
                    `${domain}/api/core/campaign_company/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: MANAGER_IN_PROGRESS
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        } else {
            await axios
                .post(
                    `${domain}/api/core/campaign_company/crawler/${job_id}/status/`,
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

        let moreButton = await page
            .waitForXPath(moreButSelector, {timeout: waitingTime})
            .catch(() => console.log(`${errorElement} more button`));
        await moreButton.click();

        await page.waitFor(waitingTime * 2);
        const companiesFilt = await page.waitForXPath(
            buttonSelector(COMPANY)
        );

        await companiesFilt.click();
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
            if (max_companies && target_page_limit) {
                await axios
                    .post(
                        `${domain}/api/core/campaign_company/crawler/${job_id}/worker-job/`,
                        JSON.stringify({
                            total_pages: target_page_limit
                        })
                    )
                    .then(() => console.log("Success"))
                    .catch(() => console.log("Failed"));

                if (max_companies) {
                    limit = Math.min(limit, numPage, max_companies / 10);
                } else {
                    limit = Math.min(limit, numPage);
                }
            } else if (!max_companies) {
                let numPage = await page
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
                    numPage = parseInt(numPage) / 10;
                    if (numPage > limit) {
                        await axios
                            .post(
                                `${domain}/api/core/campaign_company/crawler/${job_id}/worker-job/`,
                                JSON.stringify({
                                    total_pages: numPage - limit
                                })
                            )
                            .then(() => console.log("Success"))
                            .catch(() => console.log("Failed"));
                    }
                    if (numPage < limit) {
                        limit = numPage;
                    }
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

        let runningLimit = limit * 10;
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
                const link = await linkSelector(profileSelector, x, page).catch(() =>
                    console.log(`${errorElement} link`)
                );
                if (link) {
                    await parseData(browser, link._remoteObject.value, job_id, white_list, max_people, get_people);
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
            await axios
                .post(
                    `${domain}/api/core/campaign_company/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: MANAGER_DONE
                    })
                )
                .then(() => console.log("Success Done"))
                .catch(() => console.log("Failed Done"));

        } else {
            await axios
                .post(
                    `${domain}/api/core/campaign_company/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: WORKER_DONE
                    })
                )
                .then(() => console.log("Success Done"))
                .catch(() => console.log("Failed Done"));
        }
    } catch
        (err) {
        throw err;
    } finally {
        console.log("end");
        await browser.close();
        await axios
            .post(`${domain}/api/core/common/job/${job_id}/end/`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }
}
;


async function parseData(browser, link, job_id, white_list, max_people, get_people) {
    const textSelector = value => `//*[text() = "${value}"]`;
    const textContainSelector = value =>
        `//span[contains(text(), "${value}")]`;
    const companyNameSel = '//h1[contains(@class, "summary__title")]';
    const containsClassSelector = value => `//*[contains(@class, "${value}")]`;

    try {
        const profilePage = await browser.newPage();
        await profilePage.goto(link, {waitUntil: "domcontentloaded"});
        await profilePage.waitFor(waitingTime);

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

        // The case when we want to grab employees details as well
        let list_employees = [];
        if (get_people) {
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
                    {polling: polling, timeout: timeout}
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
                    if (position) {
                        position = position._remoteObject.value.toString();
                        position = position.split("at")[0].toLowerCase().trim();

                        // if this position title is in the white list
                        if (white_list && white_list.map(x => x.includes(position)).some(x => x)) {
                            let name = await getEmployeeName(
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
                            let name = await getEmployeeName(
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
        }

        if (max_people && list_employees.length > max_people) {
            list_employees = list_employees.slice(0, max_people);
        }
        console.log("EMPLOYEES", list_employees);
        await axios
            .post(
                `${domain}/api/core/campaign_company/crawler/${job_id}/add/`,
                JSON.stringify({
                    data: {
                        overview,
                        domain: website,
                        headquarters,
                        founded,
                        followers,
                        numEmployees,
                        company: companyName,
                        employees: list_employees,
                    },
                })
            )
            .then(() => console.log("Success"))
            .catch(() => console.log("Failed"));

        await profilePage.close();
    } catch (err) {
        throw err;
    }
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