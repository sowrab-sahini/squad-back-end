// This file contains code to get search results from database.

const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.post("/", [
  (req, res, next) => {
    if (!req.body.search_key)
      return res.status(400).send({ message: "search_key not found" });
    else next();
  },
  (req, res, next) => {
    try {
      const updated_key = "%" + req.body.search_key + "%";
      db.query(
        "SELECT item_id, item_name, item_image FROM squad.items WHERE item_name like ? LIMIT 3",
        [updated_key],
        (error, item_name) => {
          if (error)
            return res.status(500).send({ message: "Internal Server Error" });
          db.query(
            "SELECT item_id, item_name, item_image FROM squad.items WHERE item_ingredients like ? LIMIT 3",
            [updated_key],
            (error, item_ingredients) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });
              return res.status(200).send({ item_name, item_ingredients });
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
