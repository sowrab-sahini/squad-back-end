// This file contains code to get store from database.

const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.post("/", [
  (req, res, next) => {
    if (!req.body.store_id)
      return res.status(400).send({ message: "Store Id not found" });
    if (!Number.isInteger(parseInt(req.body.store_id)))
      return res.status(400).send({ message: "Store Id not a number" });
    else next();
  },
  (req, res, next) => {
    try {
      db.query(
        `SELECT * FROM stores WHERE store_id = ${req.body.store_id}`,
        (error, result) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length == 0)
            return res.status(404).send({ message: "No Store" });
          return res.status(200).send(result[0]);
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
