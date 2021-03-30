"use strict";

const validateAuth = require("./validate-auth");
const notFound = require("./404");
const isUser = require("./isUser");

module.exports = { validateAuth, notFound, isUser };
