const Product = require("../models/productModel")
const { uploadImageBuffer, deleteImageByUrl } = require("../config/cloudinary");

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

    // Upload incoming image buffers to Cloudinary and keep only hosted URLs.
    const uploadedImages = req.files
      ? await Promise.all(
        req.files.map((file) =>
          uploadImageBuffer(file.buffer, {
            folder: "ptp101/products",
            resource_type: "image"
          })
        )
      )
      : []

    const images = uploadedImages.map((image) => image.secure_url)

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

    // Replace old images when new files are uploaded.
    if (req.files && req.files.length > 0) {
      await Promise.all(
        (product.images || []).map((imageUrl) =>
          deleteImageByUrl(imageUrl).catch(() => null)
        )
      )

      const uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadImageBuffer(file.buffer, {
            folder: "ptp/products",
            resource_type: "image"
          })
        )
      )

      const newImages = uploadedImages.map((image) => image.secure_url)
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
      await Promise.all(
        (product.images || []).map((imageUrl) =>
          deleteImageByUrl(imageUrl).catch(() => null)
        )
      )
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}