// This file contains code to get item from database.

const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.post("/", [
  (req, res, next) => {
    if (!req.body.item_id)
      return res.status(400).send({ message: "Item Id not found" });
    if (!Number.isInteger(parseInt(req.body.item_id)))
      return res.status(400).send({ message: "Item Id not a number" });
    else next();
  },
  (req, res, next) => {
    try {
      db.query(
        `SELECT * FROM items WHERE item_id = ${req.body.item_id}`,
        (error, result) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length == 0)
            return res.status(404).send({ message: "No Item" });
          db.query(
            `SELECT * FROM stores WHERE store_id = ${result[0].store_id}`,
            (error, results) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });
              if (results.length == 0)
                return res.status(404).send({ message: "No Store" });
              result[0].store = results[0];
              return res.status(200).send(result[0]);
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
