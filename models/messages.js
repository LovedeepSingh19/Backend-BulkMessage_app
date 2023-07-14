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
});

module.exports = mongoose.model("Messages", tempSchema);
