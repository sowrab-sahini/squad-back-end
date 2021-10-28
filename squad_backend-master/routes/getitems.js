// This file contains code to get store and all its items from database.

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
          let results = {
            store: {
              store_id: result[0].store_id,
              store_name: result[0].store_name,
              store_timing: result[0].store_timing,
              store_location: result[0].store_location,
              store_image: result[0].store_image,
              hall_price: result[0].hall_price,
            },
            items: [],
          };
          db.query(
            `SELECT * FROM items WHERE store_id = ${req.body.store_id}`,
            (error, result) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });
              results.items = result;
              return res.status(200).send(results);
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
