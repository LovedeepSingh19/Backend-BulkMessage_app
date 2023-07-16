const express = require("express");
const app = express();

require("dotenv").config();

const port = 8080 || process.env.PORT;

var corsOptions = {
  origin: 'https://poetic-cheesecake-f4aafb.netlify.app/',
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}


const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to mongo `Successful"))
.catch((err) => console.log("error " + err));

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("./routes/routes"));

const server = app.listen(port, () => {
  console.log("server running on Port: " + port);
});