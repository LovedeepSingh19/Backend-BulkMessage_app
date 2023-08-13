const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tempSchema = new Schema({
  _id: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  body: {
    type: String,
  },
  whatsApp: {
    type: Boolean,
  },
  sms: {
    type: Boolean,
  },
  email: {
    type: Boolean,
  },
  timeStamp: {
    type: Number,
  },
  google_app_password: {
    type: String,
  },
  sms_account_sid: {
    type: String,
  },
  sms_auth_token: {
    type: String,
  },
  sms_service_sid: {
    type: String,
  }
});

module.exports = mongoose.model("Messages", tempSchema);
