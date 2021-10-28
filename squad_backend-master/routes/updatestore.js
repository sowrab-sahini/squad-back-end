// This file contains code to update store in database after token is validated and send email which contains updated password to login.

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
    if (!req.headers.token)
      return res.status(400).send({ message: "Auth Token not found" });
    else next();
  },
  (req, res, next) => {
    if (req.headers.token === "onk93vo2n6j5uv6on6q8c") {
      next();
    } else return res.status(401).send({ message: "Invalid Auth Token" });
  },
  (req, res, next) => {
    try {
      db.query(
        `SELECT store_id FROM stores WHERE admin_email = '${req.body.email}'`,
        (error, result) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length == 0 || result[0].store_id == req.body.id) {
            const password = getRandomPassword();
            const hash = bcrypt.hashSync(password, 10);
            const data = {
              store_id: req.body.id,
              email: req.body.email,
              name: req.body.name,
              price: parseFloat(req.body.price),
              type: parseInt(req.body.type),
              location: req.body.location,
              timings: req.body.timings,
              image: req.body.image,
            };
            let sql;
            if (req.body.image) {
              sql = `UPDATE stores SET store_name = ?, admin_email = ?,hall_price = ?, store_timing = ?, is_retail = ?, store_location = ?, store_image = ? WHERE store_id = ?`;
              sqll = [
                data.name,
                data.email,
                data.price,
                data.timings,
                data.type,
                data.location,
                data.image,
                data.store_id,
              ];
            } else {
              sql = `UPDATE stores SET store_name = ?, admin_email = ?,hall_price = ?, store_timing = ?, is_retail = ?, store_location = ? WHERE store_id = ?`;
              sqll = [
                data.name,
                data.email,
                data.price,
                data.timings,
                data.type,
                data.location,
                data.store_id,
              ];
            }
            db.query(sql, sqll, (error, results) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });

              var mailOptions = {
                from: "squadunt@gmail.com",
                to: data.email,
                subject: `Hello ${data.name}! Here is Your Updated Credentials.`,
                html: `<h1>Hello ${data.name}</h1>
            <h2>Your details are updated successfully, You can Log In Now! Below are your Credentials.</h2><br/><br/><b>Password : ${password}</b>
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
                    .send({ message: "successfully updated store!" });
              });
            });
          } else
            return res
              .status(401)
              .send({ message: "Email Registered with Other Store" });
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
