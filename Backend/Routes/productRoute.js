const express = require('express')
const {verifyToken,isSeller} = require('../MiddleWares/authMiddleware')
const {upload} = require('../MiddleWares/multer')
const {addProduct,updateProduct,getProductsByStore,removeProduct,getAllProducts,searchProduct,
    getProductDetails,getStoreProducts,searchByCategory,addReviews
} = require('../Controllers/productController')
const product_router = express.Router()

//sellers routes
product_router.post('/marketplace/seller/addproduct/:storeId',verifyToken,isSeller, upload.array('productImages',5),addProduct)
product_router.delete('/marketplace/seller/deleteproduct/:productId',verifyToken,isSeller,removeProduct)
product_router.put('/marketplace/seller/updateproduct/:productId', verifyToken,isSeller,upload.array('productImages',5),updateProduct)
product_router.get('/marketplace/seller/getproducts/:storeId',verifyToken,isSeller,getProductsByStore)


//customers routes
//product_router.get('/marketplace/seller/getproducts/:storeId',verifyToken,getProductsByStore)
product_router.get('/marketplace/buyer/getallproducts',getAllProducts)
product_router.get('/marketplace/buyer/getproductdetails/:productId',getProductDetails)
product_router.get('/marketplace/buyer/getbycategory/:category',searchByCategory)
product_router.put('/marketplace/buyer/review/:productId',verifyToken,addReviews)
product_router.get('/marketplace/buyer/getstoreproducts/:storeId',verifyToken,getStoreProducts)

product_router.get('/marketplace/buyer/searchproduct',verifyToken,searchProduct)

module.exports = product_router