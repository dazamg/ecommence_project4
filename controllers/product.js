const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

// Delete a Product with the specified id in the request
exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
      // Find Product by the id being passed by id then remove it
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.staus(400).send("Product delete failed");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  //Retreive the product with the id and populate the subs and category 
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

//Update Product model
exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (err) {
    console.log("<----PRODUCT UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

//Retreive Product from database
exports.getAll = async (req, res) => {
  console.log(req.body)
  try {
    const {sort, order, page} = req.body
    const currentPage = page || 1
    const perPage = 3
    const products = await Product.find({})
    .skip((currentPage - 1)* perPage) 
    .populate("category")
    .populate("subs")
    .sort([[sort, order]])
    .limit(perPage)
    .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Product fetched failed");
  }
};


//Get THE TOTAL NUMBER OF Porduct from database
exports.productCount = async (req, res) => {
  // estimatedDocumentCount is a mongoose method to get the total number of count
  let total = await Product.find({}).estimatedDocumentCount().exec()
  res.json(total);
};

//Search //Filter

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch(err) {
    console.log(err)
  }
 }

 const handleSub = async (req, res, sub) => {
    const products = await Product.find({subs: sub})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

    res.json(products)
 }

exports.searchFilters = async (req, res) => {
  const { query, price, category, sub } = req.body;

  if (query) {
    console.log("query --->", query);
    await handleQuery(req, res, query);
  }

  // price [20, 200]
  if (price !== undefined) {
    console.log("price ---> ", price);
    await handlePrice(req, res, price);
  }
  if(category) {
    console.log("caegory --->", category)
    await handleCategory(req, res, category);
  }
  if(sub) {
    console.log("caegory --->", sub)
    await handleSub(req, res, sub);
  }
};
