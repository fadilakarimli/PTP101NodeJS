const express = require('express')
const router = express.Router()
const { register, login , verifyAccount} = require('../controllers/authController')


router.post('/register', register)
router.post('/login', login)
router.get("/verify/:token", verifyAccount);

module.exports = router