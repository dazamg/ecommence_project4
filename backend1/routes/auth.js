const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { createOrUpdateUser, currentUser } = require("../controllers/auth");


router.post("/create-or-update-user", authCheck, createOrUpdateUser);
//user route
router.post("/current-user", authCheck, currentUser);
//Admin route
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
