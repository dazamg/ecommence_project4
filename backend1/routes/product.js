const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  listAll,
  remove,
  read,
  update,
  getAll,
  productCount,
} = require("../controllers/product");
const product = require("../models/product");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productCount);
router.get("/products/:count", listAll); 
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

//Home routes'
router.post("/products/", getAll);


module.exports = router;