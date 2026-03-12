const express = require('express')
const path = require('path')
const connectDB = require('./config')
const loggerMiddleware = require("./middlewares/loggerMiddleware")
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')

const app = express()
const PORT = process.env.PORT || 4000

// Use the logger middleware
app.use(loggerMiddleware)

// Middlewares
app.use(express.json())

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/categories', categoryRoute)
app.use('/api/products', productRoute)

// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} link: http://localhost:${PORT}`)
    })
})