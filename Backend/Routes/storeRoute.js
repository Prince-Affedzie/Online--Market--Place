const express = require('express')
const {verifyToken,isSeller} = require('../MiddleWares/authMiddleware')
const {sell,createStore,getStore,updateStore,getAllStores,getStoreDetails,getSellerStores,sellerGetStore,
    runDiscount,endDiscount
} = require('../Controllers/storeController')
const {upload} = require('../MiddleWares/multer')
const store_router = express.Router()

store_router.post('/marketplace/createstore',verifyToken,isSeller,upload.fields([
{name:'storeLogo',maxCount:1},
{name: 'storeBanner',maxCount:1}
]),createStore)
store_router.get('/marketplace/getstore/:storeId', verifyToken,getStore)
store_router.get('/marketplace/getstoredetails/:storeId',verifyToken,getStoreDetails)
store_router.get('/marketplace/getallstores', verifyToken,getAllStores)

// sellers routes
store_router.post('/marketplace/sell',verifyToken,sell)
store_router.get('/marketplace/storeoverview/:storeId', verifyToken, isSeller,sellerGetStore)
store_router.get('/marketplace/getsellerstores', verifyToken,isSeller,getSellerStores)
store_router.put('/marketplace/updatestore/:storeId',verifyToken,isSeller,upload.fields([
    {name:'storeLogo',maxCount:1},
    {name: 'storeBanner',maxCount:1}
    ]),updateStore)
store_router.put('/marketplace/rundiscount/:productId',verifyToken,isSeller,runDiscount)
store_router.put('/marketplace/enddiscount/:productId',verifyToken,isSeller,endDiscount)


module.exports = store_router

