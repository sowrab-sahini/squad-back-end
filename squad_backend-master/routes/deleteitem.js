// This file contains code to delete item from database after token is validated.

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
    try {
      db.query(
        `SELECT store_id FROM stores WHERE access_token = '${req.headers.token}'`,
        (error, result) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          if (result.length > 0) {
            db.query(
              `DELETE FROM items WHERE item_id = ${req.body.item_id} AND store_id = ${result[0].store_id}`,
              (error, results) => {
                if (error)
                  return res
                    .status(500)
                    .send({ message: "Internal Server Error" });
                return res
                  .status(200)
                  .send({ message: "successfully deleted item!" });
              }
            );
          } else return res.status(401).send({ message: "Invalid Auth Token" });
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
