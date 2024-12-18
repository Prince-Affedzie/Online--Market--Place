const express = require('express')
const order_router =  express.Router()
const {placeOrder,viewOrder,sellerViewOrders,cancelOrder} = require('../Controllers/orderController')
const {verifyToken} = require('../MiddleWares/authMiddleware')



order_router.post('/marketplace/buyer/placeorder',verifyToken,placeOrder)
order_router.get('/marketplace/buyer/vieworders',verifyToken,viewOrder)
order_router.post('/marketplace/buyer/cancelorder/:orderId',verifyToken,cancelOrder)

order_router.get('/marketplace/seller/vieworders/:storeId',verifyToken,sellerViewOrders)




module.exports = order_router