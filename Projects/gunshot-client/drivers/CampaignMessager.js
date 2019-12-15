// const extLoginFunc = require("./SignIn");
// const axios = require("axios");

// module.exports.sendMessage = async function sendMessageList() {
//   let status;
// const domain = "http://gunshot.phanatic.io";
//   const data = await axios
//     .get(`${domain}/api/get-message`)
//     .then(d => d.data.data)
//     .catch(err => console.log(err));

//   console.log(data);
//   const cookies = await axios
//     .get(`${domain}/api/cookies/get`, {
//       data: {
//         email: data.gmail_data.email
//       }
//     })
//     .then(d => d.data.data.cookies)
//     .catch(err => console.log(err));

//   const emailGmail = data.gmail_data.email;
//   const password = data.gmail_data.password;
//   const recoveryEmail = data.gmail_data.recovery_email;
//   const passwordLinkedIn = data.gmail_data.password_linkedin;
//   const phoneNumber = data.gmail_data.gvoice_number;
//   const firstNameValue = data.profile_details.first_name;
//   const proxy = data.proxy;
//   const id = data.account_id;
//   const message_id = data.message_id;
//   const actions = data.actions;
//   const textMessage = data.message_text;
//   const restrictions = data.restrictions;

//   let delayNum = () => {
//     return Math.ceil(Math.random() * 100 + 100);
//   };
//   const timeout = 60000;
//   const waitingTime = 3000;
//   const errorElement = "Can't find";

//   const allConnectionsSelector =
//     '//h3[text() = "Your connections"]/following-sibling::a';
//   const messageButtonSelector = '//span[text() = "Message"]/parent::button';
//   const textFieldSelector =
//     '//*[contains(@data-placeholder, "Write a message")]/preceding-sibling::div//p';
//   const sendButtonSelector = '//button[text() = "Send"]';
//   const connectionSelector =
//     '//span[contains(text(), "Connection")]/parent::span/parent::div/parent::div/following-sibling::div//span';
//   const buttonSelector = value => `//*[text() = "${value}"]`;
//   const wallPostSelector =
//     '//span[text() = "What do you want to talk about?"]/following-sibling::div//p';
//   const groupsBtnSel = '//*[@data-control-name = "groups"]';
//   const groupSelector = '//li[contains(@class, "list__item")]//a';
//   const textAreaSelector = '//*[contains(text(), "Write here")]';
//   const submitClassSelector = '//button[contains(@class, "button-primary")]';

//   let count = 0;
//   let height = 0;
//   let messagesArray, messageButtonArray, browser, page, breaking;

//   try {
//     main = await extLoginFunc.signIn(
//       emailGmail,
//       password,
//       recoveryEmail,
//       passwordLinkedIn,
//       phoneNumber,
//       firstNameValue,
//       proxy,
//       cookies,
//       id
//     );

//     if (main[0] === "restricted" || main[0] === "robot") {
//       console.log("Account restricted");
//       browser = main[1];
//       await axios
//         .put(`${domain}/api/linkedin-account-blocked`, JSON.stringify({ id }))
//         .then(res => console.log(res))
//         .catch(err => console.log(err));
//       await axios
//         .put(
//           `${domain}/api/credentials/update-status`,
//           JSON.stringify({ proxy, status: "BLOCKED" })
//         )
//         .then(res => console.log(res))
//         .catch(err => console.log(err));
//     } else {
//       page = main[0];
//       browser = main[1];

//       await page.goto("https://www.linkedin.com/feed/", {
//         waitUntil: "domcontentloaded"
//       });

//       await page.waitFor(waitingTime * 3);
//       // Grab number of connections
//       let numConnections = await page
//         .waitForFunction(
//           sel => {
//             return document.evaluate(
//               sel,
//               document,
//               null,
//               XPathResult.FIRST_ORDERED_NODE_TYPE,
//               null
//             ).singleNodeValue.innerText;
//           },
//           { timeout: waitingTime * 2 },
//           connectionSelector
//         )
//         .catch(() => console.log(`${errorElement} number of connections`));

//       if (numConnections) {
//         console.log(numConnections._remoteObject.value);
//         await axios
//           .put(
//             `${domain}/api/update-linkedin-connections`,
//             JSON.stringify({
//               connections: numConnections._remoteObject.value,
//               id
//             })
//           )
//           .then(res => console.log(res))
//           .catch(err => console.log(err));
//       } else {
//         console.log("There aren't any connections");
//       }

//       // Check notifications and messages

//       const notifications = await page.waitForXPath(
//         buttonSelector("Notifications")
//       );
//       await notifications.click();
//       await page.waitFor(waitingTime * 2);

//       const messages = await page.waitForXPath(buttonSelector("Messaging"));
//       await messages.click();
//       await page.waitFor(waitingTime * 2);

//       const gotItBtn = await page
//         .waitForXPath(buttonSelector("Got it"), { timeout: waitingTime })
//         .catch(() => console.log("No need to skip"));

//       if (gotItBtn) {
//         await gotItBtn.click();
//       }

//       const gotItBtn2 = await page
//         .waitForXPath(submitClassSelector, { timeout: waitingTime })
//         .catch(() => console.log("No need to skip"));

//       if (gotItBtn2) {
//         await gotItBtn2.click();
//       }

//       //  Check if smbd invite you to create connection
//       const connections = await page.waitForXPath(buttonSelector("My Network"));
//       await connections.click();
//       console.log("Inside of connections");
//       await page.waitFor(waitingTime * 3);
//       const invitations = await page
//         .$x(buttonSelector("Accept"))
//         .catch(() => console.log("There aren't any invitation"));
//       if (invitations.length > 0) {
//         for (let i in invitations) {
//           await invitations[i].click();
//           await page.waitFor(waitingTime);
//         }
//       }

//       // Go to groups and add a post
//       if (actions.includes("Group")) {
//         await page.waitFor(waitingTime * 3);
//         const groupsBtn = await page
//           .waitForXPath(groupsBtnSel, { timeout: waitingTime })
//           .catch(() => console.log("You have no groups in your list"));
//         if (groupsBtn) {
//           await groupsBtn.click();

//           await page.waitFor(waitingTime);

//           await page
//             .waitForFunction(
//               () => {
//                 return window.scrollBy(0, window.innerHeight);
//               },
//               { timeout: waitingTime }
//             )
//             .catch(() => console.log("scrolled"));

//           let numberIterations = actions.filter(x => x === "Group").length;
//           for (let i = 0; i < numberIterations; i++) {
//             let group_url = await page
//               .waitForFunction(
//                 args => {
//                   const elements = [];
//                   const element = document.evaluate(
//                     args[0],
//                     document,
//                     null,
//                     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
//                     null
//                   );
//                   for (
//                     let a = 0, length = element.snapshotLength;
//                     a < length;
//                     a++
//                   ) {
//                     elements.push(element.snapshotItem(a));
//                   }
//                   if (elements[args[1]]) {
//                     return elements[args[1]].href;
//                   }
//                 },
//                 { timeout: waitingTime },
//                 [groupSelector, i]
//               )
//               .catch(() => {
//                 console.log("not enough groups");
//                 breaking = true;
//               });

//             if (breaking) {
//               break;
//             }
//             group_url = group_url._remoteObject.value;
//             let group_id = group_url.split("groups");
//             group_id = group_id[group_id.length - 1].replace(/[/]/g, "");
//             console.log(group_id);
//             if (restrictions.includes(group_id)) {
//               console.log("restricted");
//               numberIterations++;
//             } else {
//               const groupPage = await browser.newPage();
//               await groupPage.goto(group_url, {
//                 waitUntil: "domcontentloaded"
//               });
//               await groupPage.waitFor(waitingTime);

//               // Write a post

//               const startPostBtn = await groupPage
//                 .waitForXPath(buttonSelector("Start a post"), {
//                   timeout: waitingTime
//                 })
//                 .catch(() => console.log(`${errorElement} post button`));

//               let postBtn;
//               if (startPostBtn) {
//                 await startPostBtn.click();
//               } else {
//                 postBtn = await groupPage.waitForXPath(buttonSelector("Post"));
//                 await postBtn.click();
//               }

//               const textArea = await groupPage
//                 .waitForXPath(textAreaSelector, { timeout: waitingTime })
//                 .catch(() => console.log(`${errorElement} text field`));
//               if (textArea) {
//                 await textArea.type(textMessage, { delay: delayNum() });
//               } else {
//                 const textField = await groupPage.waitForXPath(
//                   wallPostSelector
//                 );
//                 await textField.type(textMessage, { delay: delayNum() });
//               }

//               postBtn = await groupPage.waitForXPath(buttonSelector("Post"));
//               await postBtn.click();

//               const postGroup = {
//                 account_id: id,
//                 message_id,
//                 target: group_id
//               };
//               await axios
//                 .post(`${domain}/api/add-history`, JSON.stringify(postGroup))
//                 .then(res => console.log(res))
//                 .catch(err => console.log(err));

//               await groupPage.close();
//             }
//           }
//         }
//       }

//       // Skip any ad.
//       await page.waitFor(waitingTime * 2);
//       await page.keyboard.press("Escape");

//       // Post smth on the wall if neeeded

//       if (actions.includes("Wall")) {
//         const home = await page.waitForXPath(buttonSelector("Home"));
//         await home.click();

//         const writePost = await page.waitForXPath(
//           buttonSelector("Start a post")
//         );
//         await writePost.click();

//         const textField = await page.waitForXPath(wallPostSelector);
//         await textField.type(textMessage, { delay: delayNum() });

//         const postButton = await page.waitForXPath(buttonSelector("Post"));
//         await postButton.click({ clickCount: 3 });

//         await page.waitFor(waitingTime * 3);

//         const writePostCheck = await page
//           .waitForXPath(buttonSelector("Start a post"))
//           .catch(() => console.log("Post hasn't been published"));

//         if (writePostCheck) {
//           const post = {
//             account_id: id,
//             message_id,
//             target: "Wall"
//           };
//           await axios
//             .post(`${domain}/api/add-history`, JSON.stringify(post))
//             .then(res => console.log(res))
//             .catch(err => console.log(err));
//         } else {
//           await sendMessageList();
//         }
//       }
//       if (actions.includes("Message")) {
//         // Go to list of connections
//         let allConnections = await page
//           .waitForFunction(
//             sel => {
//               const selector = document.evaluate(
//                 sel,
//                 document,
//                 null,
//                 XPathResult.ANY_UNORDERED_NODE_TYPE
//               ).singleNodeValue;
//               if (selector.innerText === "See all") {
//                 return selector;
//               }
//             },
//             { timeout: timeout / 4 },
//             allConnectionsSelector
//           )
//           .catch(() => console.log(`${errorElement} See All Button`));
//         if (!allConnections) {
//           allConnections = await page
//             .waitForXPath('//*[contains(@aria-label, "See all")]')
//             .catch(() => console.log(`Still ${errorElement} See All Button`));
//           if (!allConnections) {
//             console.log("You have no friends");
//             throw "No friends";
//           }
//         }
//         await allConnections.click();
//         await scroll(count);
//         await typeMessage();
//       }
//     }

//     // Scroll and check
//     async function scroll(count) {
//       await page.waitForXPath(messageButtonSelector);
//       await page
//         .waitForFunction(
//           height => {
//             return window.scrollTo(0, height + 1280);
//           },
//           { timeout: 1000 },
//           height
//         )
//         .catch(() => console.log("scrolled"));

//       height += 1280;
//       messageButtonArray = await page.$x(messageButtonSelector);

//       console.log("count", count);
//       console.log("messageButtonArray", messageButtonArray.length);
//       if (count >= messageButtonArray.length) {
//         console.log("This is the end of contact list");
//       } else {
//         console.log("Continue");
//         count += 14;
//         await scroll(count);
//       }
//     }

//     // Type a message and send
//     async function typeMessage() {
//       const linkSelector = '//*[contains(@class, "mn-connection-card__link")]';
//       for (let number in messageButtonArray) {
//         let user_id = await page
//           .waitForFunction(
//             args => {
//               const elements = [];
//               const element = document.evaluate(
//                 args[0],
//                 document,
//                 null,
//                 XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
//                 null
//               );
//               for (
//                 let a = 0, length = element.snapshotLength;
//                 a < length;
//                 a++
//               ) {
//                 elements.push(element.snapshotItem(a));
//               }
//               if (elements[args[1]]) {
//                 return elements[args[1]].href;
//               }
//             },
//             { timeout: waitingTime },
//             [linkSelector, number]
//           )
//           .catch(() => console.log("error"));
//         user_id = user_id._remoteObject.value.split("in");
//         user_id = user_id[user_id.length - 1].replace(/[/]/g, "");
//         console.log(user_id);

//         if (user_id) {
//           messagesArray = await axios
//             .get(`${domain}/api/can-send-message/${user_id}`)
//             .then(res => res.data.data.messages)
//             .catch(err => console.log(err));

//           console.log(messagesArray.text);
//           // const status = await Promise.all([
//           //   page.evaluate(el => (el.length % 2 === 0 ? true : false), id),
//           //   page.waitFor(3000)
//           // ]);
//           // if (status[0]) {
//           if (messageButtonArray[number]) {
//             for (let i in messagesArray.text) {
//               await messageButtonArray[number].click();
//               const textField = await page.waitForXPath(textFieldSelector);
//               await textField.click();
//               await textField.type(messagesArray.text[i], {
//                 delay: delayNum()
//               });

//               await page.waitFor(waitingTime * 2);

//               //Quit from chat
//               await page.keyboard.press("Escape");
//               await page.keyboard.press("Escape");
//               await page.keyboard.press("Escape");

//               //TEMPORARY CANCELLATION
//               const discard = await page.waitForXPath('//*[text()="Discard"]');
//               await discard.click();

//               console.log("Sent");
//               await page.waitFor(timeout);
//             }

//             //  Send a message
//             // const sendButton = await page.waitForFunction(
//             //   sel => {
//             //     const selector = document.evaluate(
//             //       sel,
//             //       document,
//             //       null,
//             //       XPathResult.FIRST_ORDERED_NODE_TYPE,
//             //       null
//             //     ).singleNodeValue;
//             //     if (!selector.disabled) {
//             //       return selector;
//             //     }
//             //   },
//             //   { timeout: waitingTime },
//             //   sendButtonSelector
//             // );
//             // await sendButton.click();

//             // }

//             await axios
//               .post(
//                 `${domain}/api/add-history`,
//                 JSON.stringify({
//                   account_id: user_id,
//                   message_id: messagesArray.mes_id
//                 })
//               )
//               .then(res => console.log(res))
//               .catch(err => console.log(err));
//           }
//         } else {
//           console.log(`${errorElement} user's id`);
//           break;
//         }
//       }
//     }
//   } catch (err) {
//     status = err;
//     throw err;
//   } finally {
//     if (!status) {
//       // Change back status to Profile Completed
//       await axios
//         .put(`${domain}/api/linkedin-account-completed`, JSON.stringify({ id }))
//         .then(() => console.log("Status changed"))
//         .catch(() => console.log("An error occured. Status didn't change"));
//     }
//     if (id) {
//       await browser.close();
//       await sendMessageList();
//     } else {
//       console.log("All messages were sent");
//       await browser.close();
//     }
//   }
// };
