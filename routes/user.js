const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//controllers
const {userCart, getUserCart} = require("../controllers/user")

//save cart
router.post('/user/cart', authCheck, userCart)
// get cart
router.get('/user/cart', authCheck, getUserCart)

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
