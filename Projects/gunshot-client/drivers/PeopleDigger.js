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


const PEOPLE = "People";
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

const linkSelector = async (selector, index, page) =>
    await page.waitForFunction(
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
    let target_page;
    const status = job.data.status;
    const mail_builder = job.data.mail_builder;
    let white_list = job.data.positions_white_list;
    let company_filter = job.data.company;
    if (company_filter) {
        company_filter = company_filter.charAt(0).toUpperCase() + company_filter.slice(1);
    }
    console.log("COMPANY FILTER", company_filter);
    const industry_filter = job.data.industry;
    const max_pages = parseInt(job.data.max_pages);
    const keyword = job.data.keyword;

    if (white_list) {
        white_list = white_list.split(",").map(x => x.toLowerCase().trim());
    }

    console.log("WHITE LIST", white_list);

    let limit = 5;
    if (status === MANAGER_READY) {
        target_page = 1;
    } else {
        target_page = parseInt(job.data.page_num);
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
    const advFilterSel = value => `//input[contains(@placeholder, "${value}")]`;
    const applyBtnSelector = '//button[contains(@class, "search-advanced-facets__button--apply")]';
    const listCompaniesDropdownSel = '//*[@class = "basic-typeahead__triggered-content search-s-add-facet__typeahead-tray"]';
    const containsText = value => `//*[contains(text(), "${value}")]`;

    try {
        if (status === MANAGER_READY) {
            await axios
                .post(
                    `${domain}/api/core/campaign_people/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: MANAGER_IN_PROGRESS
                    })
                )
                .then(() => console.log("Success"))
                .catch(() => console.log("Failed"));
        } else {
            await axios
                .post(
                    `${domain}/api/core/campaign_people/crawler/${job_id}/status/`,
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

        if (moreButton) {
            await moreButton.click();
        }
        // if we just started but couldn't find more button
        else if (i === 0) {
            const selector = await page.waitForXPath(
                buttonSelector(PEOPLE)
            );
            await selector.click();
        }

        await page.waitFor(waitingTime * 2);

        const peopleFilt = await page.waitForXPath(
            buttonSelector(PEOPLE)
        );

        await peopleFilt.click();
        await page.waitFor(waitingTime);

        // If company_filter or industry_filter exists use advanced filters
        if (company_filter || industry_filter) {
            const allFilters = await page.waitForXPath(buttonSelector("All Filters"));
            await allFilters.click();

            await page.waitFor(waitingTime);
            if (company_filter) {
                const curComp = await page.waitForXPath(advFilterSel("current company"), {timeout: waitingTime})
                    .catch(() => console.log(`${errorElement} current company input`));

                if (curComp) {
                    await curComp.click();
                    await curComp.type(company_filter, {delay: delayNum()});
                    await page.waitFor(waitingTime);
                    const listCompaniesDropdown = await page.waitForXPath(containsText(`${company_filter}`))
                        .catch(() => console.log(`${errorElement} companies dropdown`));
                    if (listCompaniesDropdown) {
                        await page.waitFor(waitingTime);
                        await listCompaniesDropdown.click();
                        await page.waitFor(waitingTime);
                    }
                }
            }
            if (industry_filter) {
                const industry = await page.waitForXPath(advFilterSel("industry"), {timeout: waitingTime})
                    .catch(() => console.log(`${errorElement} industry input`));

                if (industry) {
                    await industry.click();
                    await industry.type(industry_filter, {delay: delayNum()});
                    await page.waitFor(waitingTime);

                    const listCompaniesDropdown = await page.waitForXPath(listCompaniesDropdownSel, {timeout: waitingTime})
                        .catch(() => console.log(`${errorElement} companies dropdown`));
                    if (listCompaniesDropdown) {
                        await listCompaniesDropdown.click();
                        await page.waitFor(waitingTime);
                    }
                }
            }

            const applyButton = await page
                .waitForXPath(applyBtnSelector)
                .catch(() => console.log(`${errorElement} apply button`));
            console.log("found a button");
            await applyButton.click();
        }

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
                numPage = parseInt(numPage);

                if (max_pages) {
                    if (max_pages > limit && numPage > limit) {
                        await axios
                            .post(
                                `${domain}/api/core/campaign_people/crawler/${job_id}/worker-job/`,
                                JSON.stringify({
                                    total_pages: max_pages - limit
                                })
                            )
                            .then(() => console.log("Success"))
                            .catch(() => console.log("Failed"));
                    }
                    limit = Math.min(limit, numPage, max_pages);
                } else {
                    if (numPage > limit) {
                        await axios
                            .post(
                                `${domain}/api/core/campaign_people/crawler/${job_id}/worker-job/`,
                                JSON.stringify({
                                    total_pages: numPage - limit
                                })
                            )
                            .then(() => console.log("Success"))
                            .catch(() => console.log("Failed"));
                    }
                    limit = Math.min(limit, numPage);
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

        // Parse info from people
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

                // Check if employee's position are in the white list
                let emplPosition = await objectSelector(
                    positionSelector,
                    x,
                    ELEMENT,
                    page
                );

                emplPosition = emplPosition._remoteObject.value.toLowerCase();
                console.log("POSITION", emplPosition);
                console.log("WHITE LIST", white_list);
                if (emplPosition && white_list) {
                    for (let i of white_list) {
                        if (emplPosition.includes(i)) {
                            const link = await linkSelector(profileSelector, x, page).catch(() =>
                                console.log(`${errorElement} link`)
                            );
                            if (link) {
                                await parseData(browser, link._remoteObject.value, mail_builder, job_id);
                            }
                        }
                    }
                } else {
                    const link = await linkSelector(profileSelector, x, page).catch(() =>
                        console.log(`${errorElement} link`)
                    );
                    if (link) {
                        await parseData(browser, link._remoteObject.value, mail_builder, job_id);
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
            await axios
                .post(
                    `${domain}/api/core/campaign_people/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: MANAGER_DONE
                    })
                )
                .then(() => console.log("Success Done"))
                .catch(() => console.log("Failed Done"));

        } else {
            await axios
                .post(
                    `${domain}/api/core/campaign_people/crawler/${job_id}/status/`,
                    JSON.stringify({
                        status: WORKER_DONE
                    })
                )
                .then(() => console.log("Success Done"))
                .catch(() => console.log("Failed Done"));
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


async function parseData(browser, link, mail_builder, job_id) {
    const titleSelector = '//h2[contains(@class, "mt1")]';
    const contactInfoSel = '//*[text() = "Contact info"]';
    const emailSelector = "//section[contains(@class, 'ci-email')]";
    const containsClassSelector = value => `//*[contains(@class, "${value}")]`;

    try {
        const profilePage = await browser.newPage();
        await profilePage.goto(link, {waitUntil: "domcontentloaded"});
        await profilePage.waitFor(waitingTime);

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
                        console.log("TRY TO GENERATE EMAIL");
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
                `${domain}/api/core/campaign_people/crawler/${job_id}/add/`,
                JSON.stringify({
                    results: {
                        data: {
                            company,
                            domain: companyDomain,
                            title,
                            location,
                            name: personName,
                            originalEmail,
                            generated_email: generatedEmail
                        }
                    }
                })
            )
            .then(() => console.log("Success"))
            .catch(() => console.log("Failed"));

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


    // Scenario, when the person worked on different positions in company
    const companyLink2 = await elementSelector(companyLinkSelector2, CHILD_ELEMENT, page)
        .catch(() => console.log(`${errorElement} company link 2`));

    if (companyLink2) {
        await companyLink2.click();
    } else {
        await page.waitFor(waitingTime);
        const companyLink = await elementSelector(companyLinkSelector, ELEMENT, page)
            .catch(() => console.log(`${errorElement} company link`));
        if (companyLink) {
            await companyLink.click();
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
        companyDomain = companyDomain.replace("/", "").toLowerCase();
        return companyDomain;
    }
}


function getCleanName(name) {
    const clean_name = name.replace(/[^a-zA-Z ]/g, "").trim();
    return [clean_name.split(" ")[0], clean_name.split(" ")[1]];
}