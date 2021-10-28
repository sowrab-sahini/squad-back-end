// This file contains code to add item to database after token is validated.

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
            const data = {
              store_id: result[0].store_id,
              name: req.body.name,
              price: parseFloat(req.body.price),
              calories: parseFloat(req.body.calories),
              type: parseInt(req.body.type),
              location: req.body.location,
              ingredients: req.body.ingredients,
              description: req.body.description,
              image: req.body.image,
            };
            db.query(
              "INSERT INTO squad.items (item_name, item_price, item_availability, item_calories, item_ingredients, available_at, item_image, store_id, item_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                data.name,
                data.price,
                data.type,
                data.calories,
                data.ingredients,
                data.location,
                data.image,
                data.store_id,
                data.description,
              ],
              (error, results) => {
                if (error)
                  return res
                    .status(500)
                    .send({ message: "Internal Server Error" });
                return res
                  .status(200)
                  .send({ message: "successfully added item!" });
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
