// This file contains code to change password in database after old password is validated.

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db.js");

router.post("/", [
  (req, res, next) => {
    if (!req.body.email)
      return res.status(400).send({ message: "Email not found" });
    if (!req.body.new)
      return res.status(400).send({ message: "Password not found" });
    if (req.body.new.length < 8)
      return res
        .status(400)
        .send({ message: "Password must be 8 characters long" });
    if (req.body.new !== req.body.cnew)
      return res.status(400).send({ message: "Passwords not Match" });
    else next();
  },
  (req, res, next) => {
    try {
      db.query(
        `SELECT admin_password FROM stores where admin_email = '${req.body.email}'`,
        (err, result) => {
          if (err)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length > 0) {
            bcrypt.compare(
              req.body.old,
              result[0].admin_password,
              (err, result) => {
                if (result == true) {
                  const hash = bcrypt.hashSync(req.body.new, 10);
                  db.query(
                    `UPDATE stores SET admin_password = '${hash}' WHERE admin_email = '${req.body.email}'`,
                    (error, results) => {
                      if (error)
                        return res
                          .status(500)
                          .send({ message: "Internal Server Error" });
                      else
                        return res
                          .status(200)
                          .send({ message: "successfully changed password!" });
                    }
                  );
                } else
                  return res.status(401).send({ message: "Invalid Password" });
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
