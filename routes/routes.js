const express = require("express");
require("dotenv/config");
const router = express.Router();

const wbm = require("wbm");

const nodemailer = require("nodemailer");
const MailGen = require("mailgen");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

router.get("/", async (req, res) => {
  res.status(200).json({body: "SERVER WORKING"})
})

const Contact = require("../models/contacts");
const Message = require("../models/messages");
const User = require("../models/currentUser");

router.post("/manual-contacts", async (req, res) => {
  const { participants } = req.body;
  console.log(participants)

  try {
    for (const participant of participants) {
      const { email, phone, createdBy } = participant;

      const existingContact = await Contact.findOne({
        $and: [{ email }, {createdBy} , { phone }],
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
  const phoneNumberSMS = []
  const emails = [];

  try {
    // console.log(message);
    await Message.create(message);
    const intersection = await Contact.aggregate([
      // Match users with a phone number
      { $match: { phone: { $exists: true, $ne: "" } } },
      // Match the user with the specific _id
      { $match: { createdBy: message.createdBy } },
    ]);
    intersection.map((value) => phoneNumbers.push(value.phone));

    //If WhatsAPP Message

    if (message.whatsApp) {
      wbm
        .start({ showBrowser:true, qrCodeData: true, session: true })
        .then(async (qrCodeData) => {
          console.log(qrCodeData);
    
          // Start waiting for QR code scanning in the background
          wbm.waitQRCode()
            .then(() => {
              const phones = phoneNumbers;
              const messages = message.body;
        
              wbm.send(phones, messages)
                .then(() => {
                  wbm.end();
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));
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

      let mail = mailgen.generate(response)

      intersection.map((value) => emails.push(value.email));

      for (let email of emails) {
        let message = {
          from: process.env.GOOGLE_USERNAME,
          to: email,
          subject: "Bulk Message",
          html: mail,
        };

      transporter.sendMail(message).then(() => {
        console.log(`Email sent to ${email}`);
      }).catch((e) => {
        console.error(`Failed to send email to ${email}:`, error);
      })

    }
    res.status(201).json({msg: "You should receive an email",});

  }

  // if SMS

    if(message.sms){
      intersection.map((value) => phoneNumberSMS.push("91"+value.phone));
      sendBulkMessages(message.body, phoneNumberSMS)

res.status(201).json({msg: "You should receive your SMS",});


    } else {
      res
        .status(200)
        .json({ message: "Message added to Database successfully" });
    }

    // sendBulkMessages(message.body, phoneNumbers);
  } catch (error) {
    console.error("Error Sending Bulk Message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while Sending Bulk Message" });
  }
});

router.post("/userUpdate", async (req, res) => {
  const { user } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $set: { phoneNumber: user.phoneNumber } }
    );

    if (!updatedUser) {
      await User.create(user);
    }

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
    res.status(500).json({ error: "An error occurred while fetching messages" });
  }
});

module.exports = router;
