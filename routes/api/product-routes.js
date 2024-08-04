const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag }
      ]
    });
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          { model: Category },
          { model: Tag, through: ProductTag }
        ]
      });
      if (!product) {
        res.status(404).json({ message: 'No product found with this id!' });
        return;
      }
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
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
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (!productData[0]) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Product updated successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
