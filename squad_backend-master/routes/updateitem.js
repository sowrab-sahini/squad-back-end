// This file contains code to update item in database after token is validated.

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
              image: req.body.image ? req.body.image : null,
              id: req.body.id,
            };
            let sql;
            if (req.body.image) {
              sql = `UPDATE items SET item_name = ?, item_price = ?, item_availability = ?, item_calories = ?, item_ingredients = ?, available_at = ?, item_image = ?, item_description = ? WHERE store_id = ? AND item_id = ?`;
              sqll = [
                data.name,
                data.price,
                data.type,
                data.calories,
                data.ingredients,
                data.location,
                data.image,
                data.description,
                data.store_id,
                data.id,
              ];
            } else {
              sql = `UPDATE items SET item_name = ?, item_price = ?, item_availability = ?, item_calories = ?, item_ingredients = ?, available_at = ?, item_description = ? WHERE store_id = ? AND item_id = ?`;
              sqll = [
                data.name,
                data.price,
                data.type,
                data.calories,
                data.ingredients,
                data.location,
                data.description,
                data.store_id,
                data.id,
              ];
            }
            db.query(sql, sqll, (error, results) => {
              if (error)
                return res
                  .status(500)
                  .send({ message: "Internal Server Error" });
              return res
                .status(200)
                .send({ message: "successfully updated item!" });
            });
          } else return res.status(401).send({ message: "Invalid Auth Token" });
        }
      );
    } catch (error) {
      next(error);
    }
  },
]);

module.exports = router;
