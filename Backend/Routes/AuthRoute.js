const { Auth } = require('../MiddleWares/authMiddleware')
const express = require('express')
const authRoute = express.Router()

authRoute.get('/marketplace/seller/auth',Auth)



module.exports = authRoute