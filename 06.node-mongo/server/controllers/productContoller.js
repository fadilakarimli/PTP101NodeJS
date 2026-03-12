const Product = require("../models/productModel")
const fs = require("fs");
const path = require("path");

exports.getAllProducts = async (req, res) => {
  try {

    const { search, sort, order = "asc" } = req.query

    let query = {}

    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    let products = Product.find(query).populate("category")

    if (sort) {
      products = products.sort({ [sort]: order === "asc" ? 1 : -1 })
    }

    const result = await products

    res.json(result)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id).populate("category")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createProduct = async (req, res) => {
  try {

    const { name, description, price, stock, category } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price and category required" })
    }

    // Handle uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : []

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      images
    })

    await product.save()

    res.status(201).json(product)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Delete old images if new ones are provided
    if (req.files && req.files.length > 0) {
      // Delete old image files from disk
      product.images.forEach(image => {
        const filePath = path.join(__dirname, "../", image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Add new images
      const newImages = req.files.map(file => `/uploads/${file.filename}`)
      req.body.images = newImages
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedProduct)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)

    if (product) {
      // Delete image files from disk
      product.images.forEach(image => {
        const filePath = path.join(__dirname, "../", image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}