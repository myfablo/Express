const express = require("express");
const cors = require("cors");
const app = express();

//import files
const {
  success,
  badRequest,
} = require("./src/api/v1/helpers/response.helper.js");
const version1Index = require("./src/api/v1/index.js");

//use dependencies
app.use(cors());
app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//redirect routes

app.use("/v1", version1Index);

//for invalid requests start

app.all("*", async (req, res) => {
  await badRequest(res, "Invalid URI");
});

module.exports = app;
