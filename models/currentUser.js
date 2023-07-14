const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LLSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    emailVerified: {
        type: Boolean
    },
    image: {
        type: String,
    },
    phoneNumber: {
        type: String,
        trim: true,
    }
}); 

module.exports = mongoose.model("User", LLSchema, "User");