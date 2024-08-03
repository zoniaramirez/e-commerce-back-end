const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post("/", async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);

    if (req.body?.tagIds?.length) {
      await product.setTags(req.body.tagIds);
      await product.save();
    }

    const productWithTags = await Product.findByPk(
      product.id,
      { include: [Tag] },
    );

    return res.status(200).json(productWithTags);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  // update product data
  try {
    const product = await Product.findByPk(req.params.id);

    if (req.body?.tagIds?.length) {
      await product.setTags(req.body.tagIds);
    }

    await product.update(req.body);
    await product.save();

    const productWithTags = await Product.findByPk(
      product.id,
      { include: [Tag] },
    );

    return res.status(200).json(productWithTags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
