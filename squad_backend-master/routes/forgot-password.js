// This file contains code to update new password in database after forgot password, email is validated and new generated password is updated in database and sent to email.

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db.js");
const email = require("../email.js");

function getRandomPassword() {
  return Math.random().toString(36).substring(2, 15);
}

router.post("/", [
  (req, res, next) => {
    if (!req.body.email)
      return res.status(400).send({ message: "Email not found" });
    else next();
  },
  (req, res, next) => {
    try {
      db.query(
        `SELECT store_name FROM squad.stores WHERE admin_email = ?`,
        [req.body.email],
        (err, result) => {
          if (err)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length > 0) {
            const password = getRandomPassword();
            const hash = bcrypt.hashSync(password, 10);
            const name = result[0].store_name;
            db.query(
              `UPDATE stores SET admin_password = '${hash}' WHERE admin_email = '${req.body.email}'`,
              (error, results) => {
                if (error)
                  return res
                    .status(500)
                    .send({ message: "Internal Server Error" });

                var mailOptions = {
                  from: "squadunt@gmail.com",
                  to: req.body.email,
                  subject: `Hello ${name}! Forgot Password, No Worries.`,
                  html: `<h1>Hello ${name}</h1>
                  <h2>Forgot Password, No Worries! Below are your Credentials..</h2><br/><br/><b>Password : ${password}</b>
                  <br/><br/>Please change password by logging into your account.`,
                };

                email.sendMail(mailOptions, (error, info) => {
                  if (error)
                    return res
                      .status(500)
                      .send({ message: "Internal Server Error" });
                  else
                    return res
                      .status(200)
                      .send({ message: "successfully changed password!" });
                });
              }
            );
          } else
            return res.status(401).send({ message: "Email Does Not Exist" });
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
