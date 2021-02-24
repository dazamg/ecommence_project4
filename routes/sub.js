const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, read, update, remove, list } = require("../controllers/sub");

//Create a new sub category
router.post("/sub", authCheck, adminCheck, create);

// list subs 
router.get("/subs", list);
// retrieve sub with an id
router.get("/sub/:slug", read);
// retrieve sub with an id and update it
router.put("/sub/:slug", authCheck, adminCheck, update);
// retrieve sub with an id and and delete
router.delete("/sub/:slug", authCheck, adminCheck, remove);

module.exports = router;