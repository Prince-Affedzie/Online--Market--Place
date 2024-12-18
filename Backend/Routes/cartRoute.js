const express = require('express')
const cart_router = express.Router()
const {verifyToken} = require('../MiddleWares/authMiddleware')
const {addToCart,viewCart, updateCart,removeItemFromCart} = require('../Controllers/cartController')

cart_router.post('/marketplace/buyer/addtocart',verifyToken,addToCart)
cart_router.get('/marketplace/buyer/viewcart',verifyToken,viewCart)
cart_router.put('/marketplace/buyer/updatecart',verifyToken, updateCart)
cart_router.delete('/marketplace/buyer/removeitem',verifyToken,removeItemFromCart)

module.exports = cart_router