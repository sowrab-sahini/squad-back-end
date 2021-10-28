// This file contains code to get stores of dining halls or retail stores from database.

const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.post("/", [
  (req, res, next) => {
    try {
      db.query(
        `SELECT * FROM stores WHERE is_retail = ${req.body.is_retail ? 1 : 0}`,
        (error, results) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          let result = [];
          for (const entry of results) {
            result.push({
              store_id: entry.store_id,
              store_name: entry.store_name,
              store_timing: entry.store_timing,
              store_location: entry.store_location,
              store_image: entry.store_image,
              hall_price: entry.hall_price,
            });
          }
          return res.status(200).send(result);
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
