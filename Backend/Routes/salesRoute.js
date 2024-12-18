const express = require('express')
const sales_router = express.Router()
const {verifyToken} = require('../MiddleWares/authMiddleware')
const {getAllStoresSales,getStoreSales} = require('../Controllers/salesController')

sales_router.get('/marketplace/seller/getallstoressales',verifyToken,getAllStoresSales)
sales_router.get('/marketplace/seller/getsinglestoresales/:storeId',verifyToken,getStoreSales)


module.exports = sales_router