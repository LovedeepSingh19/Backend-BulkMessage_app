const express = require("express");
require("dotenv/config");
const router = express.Router();

var axios = require("axios");

const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");


// const { Client } = require('whatsapp-web.js');

// const wbm = require("wbm");

const SELECTORS = {
  LOADING: "progress",
  INSIDE_CHAT: "document.getElementsByClassName('two')[0]",
  QRCODE_PAGE: "body > div > div > .landing-wrapper",
  QRCODE_DATA: "div[data-ref]",
  QRCODE_DATA_ATTR: "data-ref",
  SEND_BUTTON: 'div:nth-child(2) > button > span[data-icon="send"]'
};

const args = {
  args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
  defaultViewport: chrome.defaultViewport,
  executablePath: await chrome.executablePath,  
  //  "/opt/homebrew/bin/chromium",
  
  headless: false,
  ignoreHTTPSErrors: true,
};



const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const Message = require("../models/messages");
const Contact = require("../models/contacts");
const User = require("../models/currentUser");

router.get("/", async (req, res) => {
  res.status(200).json({ data: "Working server" });
});

router.post("/manual-contacts", async (req, res) => {
  const { participants } = req.body;
  console.log(participants);

  try {
    for (const participant of participants) {
      const { email, phone, createdBy } = participant;

      const existingContact = await Contact.findOne({
        $and: [{ email }, { createdBy }, { phone }],
      });

      if (!existingContact) {
        await Contact.create(participant);
      } else {
        console.log("already exists: " + participant.email);
      }
    }

    res.status(200).json({ message: "Participants added successfully" });
  } catch (error) {
    console.error("Error adding participants:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding participants" });
  }
});

router.post("/getContacts", async (req, res) => {
  const { uid } = req.body;
  try {
    const items = await Contact.find({ createdBy: uid });
    console.log(items);

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "An error occurred while fetching items" });
  }
});

router.post("/delete", async (req, res) => {
  const { uid } = req.body;

  try {
    const deletedContact = await Contact.findOneAndDelete({ email: uid });
    if (!deletedContact) {
      console.log("Document not found");
      res.status(404).json({ error: "Document not found" });
      return;
    }

    console.log("User deleted:", deletedContact);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

// Messagign ((SMS))

function sendBulkMessages(messageBody, numberList) {
  var numbers = [];
  for (i = 0; i < numberList.length; i++) {
    numbers.push(
      JSON.stringify({
        binding_type: "sms",
        address: numberList[i],
      })
    );
  }

  const notificationOpts = {
    toBinding: numbers,
    body: messageBody,
  };

  client.notify.v1
    .services(process.env.SERVICE_SID)
    .notifications.create(notificationOpts)
    .then((notification) => console.log(notification.sid))
    .catch((error) => console.log(error));
}


router.post("/sendMessage", async (req, res) => {
  const { message } = req.body;
  const phoneNumbers = [];
  const phoneNumberSMS = [];
  const emails = [];

  try {
    // console.log(message);
    await Message.create(message);
    const intersection = await Contact.aggregate([
      { $match: { phone: { $exists: true, $ne: "" } } },

      { $match: { createdBy: message.createdBy } },
    ]);
    intersection.map((value) => phoneNumbers.push("+91 "+value.phone));

    //If WhatsAPP Message

    if (message.whatsApp) {
      // res.status(200).json({number: phoneNumbers})

console.log("fuck")



    try {
        browser = await puppeteer.launch(args);
        page = await browser.newPage();
        page.setDefaultTimeout(30000);

        await page.goto(`https://web.whatsapp.com`);
        async function getQRCodeData() {
          await page.waitForSelector(SELECTORS.QRCODE_DATA, { timeout: 30000 });
          const qrcodeData = await page.evaluate((SELECTORS) => {
              let qrcodeDiv = document.querySelector(SELECTORS.QRCODE_DATA);
              return qrcodeDiv.getAttribute(SELECTORS.QRCODE_DATA_ATTR);
          }, SELECTORS);
          return await qrcodeData;
      }

      
      setTimeout(async () => {
        const qrcodeData = await getQRCodeData();
        res.status(200).json({qr: qrcodeData})},8000)
        
      getQRCodeData().then(() => {
        
        setTimeout(async () => {

          try {
          for (let num of phoneNumbers) {
            await page.goto(`https://web.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(message.body)}`);
            await page.waitForSelector(SELECTORS.LOADING, { hidden: true, timeout: 22000 });
            await page.waitForSelector(SELECTORS.SEND_BUTTON, { timeout: 22000 });
            await page.keyboard.press("Enter");
            await page.waitFor(1000);
            
          }
        } catch (e) {
          console.error("Error occurred:", e);
        } finally {
          await browser.close();
        }
        
        
      }, 5000)
        
    });

      }
            catch(e){
              console.log("BIG ERROR: ", e)
            }

     

      // wbm
      //   .start({ qrCodeData: true, session: true, showBrowser: false })
      //   .then(async (qrCodeData) => {

      //     const messages = message.body;
      //     res.status(200).json({ qr: qrCodeData });
      //     await wbm.waitQRCode();

      //     await wbm.send(phoneNumbers, messages);
      //     await wbm.end();
      //   })
      //   .catch((error) => {
      //       console.log("err whatsApp: ", error);
      //     });

      // const clients = new Client();

      //       clients.on("qr", (qr) => {
      //         res.status(200).json({ qr: qr });
      //         console.log("QR RECEIVED", qr);

      //         qrcode.generate(qr, { small: true });
      //       });

      //       clients.on("ready", () => {
      //         console.log("Client is ready!");
      //         phoneNumbers.map((number) => {
      //           const chatId = number.substring(1) + "@c.us";
      //           clients.sendMessage(chatId, message.body);
      //         });
      //       })

      //       setTimeout(() => {
      //         clients.destroy();
      //         console.log("Client destroyed!");
      //       }, 500000);

      //       clients.initialize();
    }

    // if Email Message

    if (message.email) {
      let config = {
        service: "gmail",
        auth: {
          user: process.env.GOOGLE_USERNAME,
          pass: process.env.GOOGLE_APP_PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(config);

      let mailgen = new MailGen({
        theme: "default",
        product: {
          name: "Mailgen",
          link: "https://mailgen.js/",
        },
      });

      let response = {
        body: {
          name: "",
          intro: "Finally Something is working",
          table: {
            data: [{ data: message.body }],
          },
        },
      };

      let mail = mailgen.generate(response);

      intersection.map((value) => emails.push(value.email));

      try {
        let message = {
          from: process.env.GOOGLE_USERNAME,
          to: [emails],
          subject: "Bulk Message",
          html: mail,
        };

        await transporter.sendMail(message);
        console.log(`Email sent to ${emails}`);

        res.status(201).json({ msg: "You should receive an email" });
      } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).json({ error: "Failed to send email" });
      }
    }

    // if SMS

    if (message.sms) {
      intersection.map((value) => phoneNumberSMS.push("91" + value.phone));
      sendBulkMessages(message.body, phoneNumberSMS);

      res.status(201).json({ msg: "You should receive your SMS" });
    }
    if (!message.sms && !message.email && !message.whatsApp) {
      console.error("Error Sending Bulk Message: mf else res");
      res
        .status(200)
        .json({ message: "Message added to Database successfully" });
    }

    // sendBulkMessages(message.body, phoneNumbers);
  } catch (error) {
    console.error("Error Sending Bulk Message:", error);
    // res
    //   .status(500)
    //   .json({ error: "An error occurred while Sending Bulk Message" });
  }
});

router.post("/userUpdate", async (req, res) => {
  const { user } = req.body;
  console.log("User:" + user);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { phoneNumber: user.phoneNumber } }
    );

    if (!updatedUser) {
      await User.create(user);
    }
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error while Updating User:", error);
    res.status(500).json({ error: "An error occurred while Updating User" });
  }
});

router.get("/fetchMessages", async (req, res) => {
  const { createdBy } = req.query;

  try {
    const messages = await Message.find({ createdBy });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

module.exports = router;
