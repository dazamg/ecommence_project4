const express = require("express");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//controllers
const {userCart, getUserCart, emptyUserCart, saveAddress} = require("../controllers/user")

//save cart
router.post('/user/cart', authCheck, userCart)
// get cart
router.get('/user/cart', authCheck, getUserCart)

//empty cart
router.delete('/user/cart', authCheck, emptyUserCart)


router.post('/user/address', authCheck, saveAddress)
// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
