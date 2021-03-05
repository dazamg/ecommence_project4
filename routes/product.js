const express = require("express");
const router = express.Router();

// slug is the same as id but it's more precise for finding products

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
  searchFilters,
} = require("../controllers/product");


 //  Create a new product
router.post("/product", authCheck, adminCheck, create);
// Retrieve total product count
router.get("/products/total", productCount);
router.get("/products/:count", listAll); 

// Retrieve a single product with id and delete it
router.delete("/product/:slug", authCheck, adminCheck, remove);
// Retrieve a single product with id
router.get("/product/:slug", read);
// Update a single product with id
router.put("/product/:slug", authCheck, adminCheck, update);

//Home routes'
router.post("/products/", getAll);

// Search route
router.post('/search/filters', searchFilters)


module.exports = router;
