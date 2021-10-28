// This file contains code to delete store from database after token is validated.

const express = require("express");
const router = express.Router();
const db = require("../db.js");

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
        `DELETE FROM items WHERE store_id = '${req.body.store_id}'`,
        (error, result) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          db.query(
            `DELETE FROM stores WHERE store_id = ${req.body.store_id}`,
            (error, results) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });
              return res
                .status(200)
                .send({ message: "successfully deleted store!" });
            }
          );
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
