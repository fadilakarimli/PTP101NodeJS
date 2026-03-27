const express = require('express')
const path = require('path')
const cors = require('cors')
const connectDB = require('./config')
const loggerMiddleware = require("./middlewares/loggerMiddleware")
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const authRoute = require('./routes/authRoute')

const app = express()
const PORT = process.env.PORT || 4000

// Use the logger middleware
app.use(loggerMiddleware)

// Middlewares
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:8080'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
)
app.use(express.json())

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/categories', categoryRoute)
app.use('/api/products', productRoute)
app.use('/api/users', userRoute) // user route
app.use('/api/auth', authRoute) // auth route

// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} link: http://localhost:${PORT}`)
    })
})