const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSchema = new Schema({
    username: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    }
}); 


module.exports = mongoose.model("Contacts", newSchema);