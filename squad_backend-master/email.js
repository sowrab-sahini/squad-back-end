// This file contains email credentials and code to create email transporter.

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "squadunt@gmail.com",
    pass: "Squad8@UNT",
  },
});

module.exports = transporter;
