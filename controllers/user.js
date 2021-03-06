const User = require('../models/user')
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.userCart = async(req, res) => {
    // console.log(req.body)
    const { cart } = req.body;

    let products = []

    const user = await User.findOne({email: req.user.email}).exec()

    //check if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id}).exec();

    if(cartExistByThisUser) {
        cartExistByThisUser.remove()
        console.log("removed old cart");
    }

    for(let i = 0; i < cart.length; i++) {
        let cartObj = {};

        cartObj.product = cart[i]._id
        cartObj.count = cart[i].count
        cartObj.color = cart[i].color
        // get price for sub Total
        let productFromDb = await Product.findById(cart[i]._id).select("price").exec()
        cartObj.price = productFromDb.price;

        products.push(cartObj)
    }
    // console.log('products', products)

    let cartTotal = 0
    for(let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count
    }
    // console.log("cartTotal", cartTotal) 

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();
    console.log("<----new cart@@@@@@@", newCart);
    res.json({ ok: true})
}

exports.getUserCart = async(req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOne({ orderedBy: user._id }).populate(
        "products.product",
        "_id title price totalAfterDiscount")
        .exec();

        const {products, cartTotal, totalAfterDiscount} = cart
        res.json({products, cartTotal, totalAfterDiscount}); // req.data. to obtain object in the cart in the frontend
}

exports.emptyUserCart = async(req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    let cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()
    res.json(cart)
}

exports.saveAddress = async(req, res) => {
    const userAddress = await User.findOneAndUpdate( 
        { email: req.user.email },
        { address: req.user.address } 
    ).exec();

    res.json( {ok: true});
}
