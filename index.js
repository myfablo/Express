const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const { generateAdminPublicPrivateKeys, generateRiderPublicPrivateKeys, generateUserPublicPrivateKeys } = require("./src/api/v1/helpers/other.helper.js")

const app = require('./app');
const { generatePublicPrivateKeys } = require("./src/api/v1/helpers/other.helper.js");

dotenv.config((process.env.TZ = "Asia/Calcutta"));

const IP = process.env.IP || "localhost";
const port = process.env.PORT || 4160;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Express Core listening at http://${IP}:${port}`);
});

// generateAdminPublicPrivateKeys()
// generateRiderPublicPrivateKeys()
// generateUserPublicPrivateKeys();