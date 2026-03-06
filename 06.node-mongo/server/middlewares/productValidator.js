const productValidator = (req, res, next) => {

    const { title, price } = req.body

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Title cannot be empty"
        })
    }

    if (price < 0) {
        return res.status(400).json({
            message: "Price cannot be negative"
        })
    }

    next()
}

module.exports = productValidator