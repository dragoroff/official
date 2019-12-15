const puppeteer = require("puppeteer");
const axios = require("axios");
const extVerifFunc = require("./verification").verificateEmail;
const changePage = require("./changePage").changePage;
const addGroup = require("./addGroup").addGroup;
const domain = require("./domain").domain;

module.exports.signIn = async function signIn(
    emailGmail,
    password,
    recoveryEmail,
    passwordLinkedIn,
    phoneNumber,
    firstNameValue,
    proxy,
    cookies = [],
    job_id
) {
    let proxyDead = false;
    const urlLinkedin = "https://www.linkedin.com/";
    let delayNum = () => {
        return Math.ceil(Math.random() * 100 + 100);
    };

    const timeout = 60000;
    const waitingTime = 3000;
    const shortWaitingTime = 1000;
    const polling = 2000;

    const profileButtonSelector = '//*[text() = "Me"]/parent::div/parent::button';
    const emailSelector = '//input[@placeholder="Email"]';
    const passwordSelector = '//input[@placeholder="Password"]';
    const buttonSelector = '//input[@value = "Sign in"]';
    const loginVerifSelector = '//*[contains(text(), "The login attempt")]';
    const verifInputSelector = '//input[@id="input__email_verification_pin"]';
    const restrictedSelector = value => `//h1[contains(text(), "${value}")]`;
    const robotSelector = '//*[contains(@id, "captcha")]';
    const checkboxSelector = '//*[@class = "form__label"]';
    const buttonSubmit = '//button[text() = "Agree to comply"]';
    const textSelector = value => `//*[text() = "${value}"]`;
    const idSelector = value => `//*[@id = "${value}"]`;

    let result;
    let cookieStatus = true;
    let parse = false;
    try {
        console.log("proxy", proxy);
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

        const page = await browser.newPage();
        await page.deleteCookie();

        try {
            cookies = JSON.parse(cookies);
        } catch (e) {

        }

        console.log("We are in sign in");
        console.log(cookies);
        if (cookies) {
            await page.setCookie(...cookies).catch(() => (parse = true));
            if (parse) {
                cookies = JSON.parse(cookies);
                await page.setCookie(...cookies).catch(() => (cookieStatus = false));
            }
            if (!cookieStatus) {
                console.log("Cookies are invalid");
                await browser.close();
                result = await signIn(
                    emailGmail,
                    password,
                    recoveryEmail,
                    passwordLinkedIn,
                    phoneNumber,
                    firstNameValue,
                    proxy,
                    [],
                    job_id
                );
                return result;
            } else {
                let status;
                for (let i = 0; i < 5; i++) {
                    await page
                        .goto(`${urlLinkedin}feed/`, {
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
                        .post(`${domain}/api/core/common/job/${job_id}/proxy/dead/`)
                        .then(res => console.log(res))
                        .catch(err => console.log(err));
                }
                await page.waitFor(waitingTime * 3);
                const url = await page.url();
                if (url === "https://www.linkedin.com/m/login/") {
                    // Cookies are invalid
                    await axios
                        .post(
                            `${domain}/api/core/common/job/${job_id}/cookies/set/`,
                            JSON.stringify({
                                cookies: "[]"
                            })
                        )
                        .then(() => console.log("cookies success"))
                        .catch(() => console.log("cookies failed"));

                    await browser.close();
                    console.log("logining");
                    result = await signIn(
                        emailGmail,
                        password,
                        recoveryEmail,
                        passwordLinkedIn,
                        phoneNumber,
                        firstNameValue,
                        proxy,
                        [],
                        job_id
                    );
                    return result;
                } else {
                    return [page, browser];
                }
            }
        } else {
            await page
                .goto(urlLinkedin, {
                    waitUntil: "networkidle2",
                    timeout
                })
                .catch(() => (proxyDead = true));

            if (proxyDead) {
                await axios
                    .post(`${domain}/api/core/common/job/${job_id}/proxy/dead/`)
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
            }

            //LOGIN

            const signIn = await page.waitForXPath(textSelector("Sign in"), {timeout: waitingTime})
                .catch(() => console.log("No Sign In button"));

            if (signIn) {
                await signIn.click();
            }

            await page.waitFor(waitingTime);

            const email = await page
                .waitForFunction(
                    ({urlLinkedin, emailSelector}) => {
                        if (document.documentElement) {
                            if (document.location.href === urlLinkedin) {
                                const sel = document.evaluate(
                                    emailSelector,
                                    document,
                                    null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                                    null
                                ).singleNodeValue;
                                if (sel) {
                                    return sel;
                                }
                            }
                        }
                    },
                    {polling, timeout: timeout / 2},
                    {urlLinkedin, emailSelector}
                )
                .catch(() => console.log("First way of auth failed"));

            if (email) {
                const passwordField = await page.$x(passwordSelector);
                const button = await page.$x(buttonSelector);

                await email.click();
                await email.type(emailGmail, {delay: delayNum()});
                await page.waitFor(shortWaitingTime);
                await passwordField[0].click();
                await passwordField[0].type(passwordLinkedIn, {
                    delay: delayNum()
                });
                await button[0].click();
            } else {
                const signInBut = await page.waitForXPath(textSelector("Sign in"));
                await signInBut.click();

                await page.waitFor(waitingTime);

                const emailInput = await page.waitForXPath(idSelector("username"));
                await emailInput.type(emailGmail, {delay: delayNum()});

                const passwordInput = await page.waitForXPath(idSelector("password"));
                await passwordInput.type(passwordLinkedIn, {delay: delayNum()});

                const signInButton = await page.waitForXPath(textSelector("Sign in"));
                await signInButton.click();
            }

            await page.waitFor(waitingTime * 2);
            const errorPassword = await page
                .waitForXPath("//*[@id='error-for-password']", {timeout: waitingTime})
                .catch(() => console.log("Password is correct"));
            if (errorPassword) {
                await axios
                    .post(
                        `${domain}/api/core/common/job/${job_id}/event/`,
                        JSON.stringify({
                            data: {
                                eventType: "account_fresh"
                            }
                        })
                    )
                    .then(() => console.log("status success"))
                    .catch(() => console.log("status failed"));

                return [page, browser];
            } else {
                const restrictedAccount = await page
                    .waitForXPath(restrictedSelector("restricted"), {
                        timeout: waitingTime
                    })
                    .catch(() => console.log("Account not restricted"));
                const robotValid = await page
                    .waitForXPath(robotSelector, {timeout: waitingTime})
                    .catch(() => console.log("Account not restricted"));
                const smthNotRight = await page
                    .waitForXPath(restrictedSelector("Something"), {
                        timeout: waitingTime
                    })
                    .catch(() => console.log("Everything is right"));
                if (restrictedAccount) {
                    console.log("restricted");
                    // Send account is blocked
                    return ["restricted", browser];
                } else if (robotValid) {
                    console.log("robot restriction");

                    return ["robot", browser];
                } else if (smthNotRight) {
                    console.log("Suspicious number of attempts");
                    const checkbox = await page.waitForXPath(checkboxSelector);
                    await checkbox.click();
                    await page.waitFor(waitingTime);
                    const submit = await page.waitForXPath(buttonSubmit);
                    await submit.click();

                    const skipping = await page
                        .waitForXPath('//*[text() = "Skip"]', {
                            timeout: waitingTime * 3
                        })
                        .catch(() => console.log("Can't skip"));
                    if (skipping) {
                        await page.waitFor(waitingTime);
                        const URL = await page.url();
                        if (URL === "https://www.linkedin.com/feed/") {
                            let Cookies = await page.cookies();

                            await axios
                                .post(
                                    `${domain}/api/core/common/job/${job_id}/cookies/set/`,
                                    JSON.stringify({
                                        cookies: JSON.stringify(Cookies)
                                    })
                                )
                                .then(() => console.log("cookies success"))
                                .catch(() => console.log("cookies failed"));

                            await page.waitFor(waitingTime);
                            return [page, browser];
                        }
                    } else {
                        const emailPage2 = await browser.newPage();
                        const code2 = await extVerifFunc(
                            emailPage2,
                            emailGmail,
                            password,
                            recoveryEmail,
                            phoneNumber,
                            "Suspicious login",
                            firstNameValue
                        );

                        await page.bringToFront();
                        await emailPage2.close();
                        const verificationInput2 = await page.waitForXPath(
                            verifInputSelector
                        );
                        await verificationInput2.type(code2, {delay: delayNum()});
                        await page.keyboard.press("Enter");

                        const smthNotRight2 = await page
                            .waitForXPath(restrictedSelector("Something"), {
                                timeout: waitingTime
                            })
                            .catch(() => console.log("Everything is right"));
                        if (smthNotRight2) {
                            throw "Verification Error";
                        }
                    }
                } else {
                    //  Let's do a quick verification case
                    await page
                        .waitForXPath(loginVerifSelector, {timeout: waitingTime})
                        .catch(() => console.log("no need to verificate login attempt"));

                    // If we can skip
                    const skipping = await page
                        .waitForXPath('//*[text() = "Skip"]', {
                            timeout: waitingTime
                        })
                        .catch(() => console.log("Can't skip"));
                    const URL = await page.url();
                    if (URL.includes("feed")) {
                        let Cookies = await page.cookies();

                        await axios
                            .post(
                                `${domain}/api/core/common/job/${job_id}/cookies/set/`,
                                JSON.stringify({
                                    cookies: JSON.stringify(Cookies)
                                })
                            )
                            .then(() => console.log("cookies success"))
                            .catch(() => console.log("cookies failed"));

                        await page.waitFor(waitingTime);
                        return [page, browser];
                    } else if (skipping) {
                        console.log("Skip");
                        await skipping.click();
                        await page.waitFor(waitingTime * 4);
                        const currentUrl = await page.url();
                        if (currentUrl === "https://www.linkedin.com/feed/") {
                            let Cookies = await page.cookies();

                            await axios
                                .post(
                                    `${domain}/api/core/common/job/${job_id}/cookies/set/`,
                                    JSON.stringify({
                                        cookies: JSON.stringify(Cookies)
                                    })
                                )
                                .then(() => console.log("cookies success"))
                                .catch(() => console.log("cookies failed"));

                            await page.waitFor(waitingTime);
                            return [page, browser];
                        }
                    } else {
                        const emailPage = await browser.newPage();
                        const code = await extVerifFunc(
                            emailPage,
                            emailGmail,
                            password,
                            recoveryEmail,
                            phoneNumber,
                            "Suspicious login",
                            firstNameValue
                        );
                        if (!code) {
                            console.log("Email wasn't confirmed");
                            throw "Error";
                        } else {
                            //Switch to LinkedIn tab
                            await page.bringToFront();
                            await emailPage.close();
                            const verificationInput = await page.waitForXPath(
                                verifInputSelector
                            );
                            await verificationInput.type(code, {delay: delayNum()});
                            await page.keyboard.press("Enter");

                            const skip = await page
                                .waitForXPath('//*[text() = "Skip"]', {
                                    timeout: waitingTime
                                })
                                .catch(() => console.log("Can't skip"));

                            if (skip) {
                                await skip.click();
                            }

                            await page.waitFor(waitingTime * 3);
                            await page.reload();
                        }

                        await page.waitFor(timeout / 6);
                        await page.keyboard.press("Escape");
                        await page.waitForFunction(
                            ({url, selector}) => {
                                if (document.documentElement) {
                                    if (document.location.href === url) {
                                        const sel = document.evaluate(
                                            selector,
                                            document,
                                            null,
                                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                                            null
                                        ).singleNodeValue;
                                        if (sel) {
                                            return sel;
                                        }
                                    }
                                }
                            },
                            {polling, timeout: timeout / 6},
                            {url: `${urlLinkedin}feed/`, selector: profileButtonSelector}
                        );

                        //Saving cookies for future use
                        let Cookies = await page.cookies();

                        await axios
                            .post(
                                `${domain}/api/core/common/job/${job_id}/cookies/set/`,
                                JSON.stringify({
                                    cookies: JSON.stringify(Cookies)
                                })
                            )
                            .then(() => console.log("cookies success"))
                            .catch(() => console.log("cookies failed"));
                        await page.waitFor(waitingTime);

                        return [page, browser];
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return browser;
    }
};

//Connecting to groups
module.exports.connectToGroup = async function connectToGroup(
    browser,
    page,
    group
) {
    const urlLinkedin = "https://www.linkedin.com/";
    const moreButSelector = '//span[text()  = "More"]';
    const groupButtonSelector = '//*[text() = "Groups"]';
    const cancelRequestSelector = '//span[text() =  "Cancel Request"]';
    const notFoundSelector = '//*[contains(text(), "No result")]';
    const searchBoxSelector = '//input[contains(@aria-label, "Search")]';

    // let randomFromOneToTen = Math.ceil(Math.random() * 10);

    const timesNum = 4;
    let count = 1;
    const timeout = 60000;
    const waitingTime = 3000;
    const polling = 2000;
    const errorElement = "Can't find";

    let delayNum = () => {
        return Math.ceil(Math.random() * 100 + 100);
    };

    try {
        await page.waitFor(waitingTime);
        const searchBox = await page
            .waitForXPath(searchBoxSelector)
            .catch(async () => await page.reload());

        if (searchBox) {
            await searchBox.click({clickCount: 3});
            await searchBox.type(group, {delay: delayNum});
            await page.keyboard.press("Enter");
        } else {
            console.log(`${errorElement} searchbox`);
        }

        const moreButton = await page
            .waitForXPath(moreButSelector, {timeout: waitingTime * 2})
            .catch(() => console.log(`${errorElement} more button`));
        if (moreButton) {
            await page.waitFor(waitingTime * 2);
            await moreButton.click();
            const groupButton = await page
                .waitForXPath(groupButtonSelector, {timeout: waitingTime})
                .catch(() => console.log(`${errorElement} group  button`));
            if (groupButton) {
                await page.waitFor(waitingTime * 2);
                await groupButton.click();
            } else {
                console.log(`${errorElement} group button`);
            }
        } else {
            console.log(`${errorElement} more button`);
            await connectToGroup(browser, page, group);
        }

        for (let i = 0; i < timesNum; i++) {
            await page.waitFor(waitingTime * 2);
            // const notFound = await page
            //   .waitForXPath(notFoundSelector, {
            //     timeout: waitingTime * 3
            //   })
            //   .catch(() => console.log("Didn't get an error"));
            // if (notFound) {
            //   console.log("not found");
            //   await page.waitFor(waitingTime * 2);
            //   await searchBox.click({ clickCount: 3 });
            //   await page.keyboard.type(group, { delay: delayNum() });
            //   await page.keyboard.press("Enter");
            // } else {
            console.log("continue adding group");
            await addGroup(browser, page);
            count = await changePage(count, page);
            // }
        }
        const actualURL = await page.url();
        await page.goto(`${urlLinkedin}feed/`, {
            waitUntil: "domcontentloaded",
            referer: actualURL
        });
    } catch (err) {
        console.log(err);
    } finally {
        console.log("end of adding group");
    }
};

// Add Likes
module.exports.addLikes = async function addLikes(page) {
    const likeButtonSelector = '//*[contains(@class, "react-button__text")]';

    const timesNum = 3;
    let count = 0;
    const timeout = 60000;
    const waitingTime = 3000;
    const polling = 2000;

    let randomFromOneToTen = Math.ceil(Math.random() * 10);

    try {
        for (let i = 0; i < timesNum; i++) {
            count = await scrollAndLike(count);
        }

        async function scrollAndLike(count) {
            await page
                .waitForFunction(
                    () => {
                        return window.scrollBy(0, window.innerHeight);
                    },
                    {polling: polling, timeout: timeout / 3}
                )
                .catch(() => {
                    console.log(timeout / 3 / polling);
                });

            let likeBut = await page.$x(likeButtonSelector);

            if (likeBut[randomFromOneToTen - 1 + count]) {
                await likeBut[randomFromOneToTen - 1 + count]
                    .click()
                    .catch(() => console.log(`${errorElement} like button`));
                console.log("Click");
                await page.waitFor(waitingTime * 2);
            }

            if (likeBut[randomFromOneToTen - 1 + 8 + count]) {
                await likeBut[randomFromOneToTen - 1 + 8 + count]
                    .click()
                    .catch(() => console.log(`${errorElement} like button`));
                console.log("Click");
                await page.waitFor(waitingTime * 2);
            }

            count += timeout / 3 / polling;
            return count;
        }
    } catch (err) {
        throw err;
    }
};
