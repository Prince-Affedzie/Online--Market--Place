const  {Products} = require('../Models/ProductsModel')
const {Stores}= require("../Models/StoresModel")
const fs = require('fs')
const path = require('path')


const addProduct = async(req,res)=>{
    try{
        const {storeId} = req.params
        const store = await Stores.findById(storeId)
        const {title,description,price,stock, category,subcategory} = req.body
        console.log(req.files)
        const productImages = req.files ? req.files.map(file => file.filename) : [];
        const product = new Products({
            store_id: storeId,
            title:title,
            description:description,
            price:parseInt(price),
            stock:stock,
            category:category,
            subcategory:subcategory,
            images: productImages
        })
        if (!store.store_products) {
            store.store_products = [];
          }
        store.store_products.push(product);
        await store.save()
        await product.save()
        res.status(200).json('Product Added Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json("Internal Server Error")
    }
}

const updateProduct = async(req,res)=>{
    try{
        const {productId} = req.params
        console.log(req.body)
        const {title,description,price,stock, category, imagesToDelete} = req.body
        const product = await Products.findById(productId)
        if(!product){
            return res.status(404).json('Product not found')
        }
        product.title = title || product.title
        product.description = description || product.description
        product.price = price || product.price
        product.stock = stock || product.stock
        product.category = category || product.category

        if(req.files){
          
            const newImages = req.files.map(file => file.filename);
            product.images = [...product.images, ...newImages];
           // product.images = req.files['productImages'][0].filename
        }
        if(imagesToDelete ){
            if(Array.isArray(imagesToDelete)){
                imagesToDelete.forEach((image)=>{
                    product.images = product.images.filter(file=> file !== image)
                    const imagePath = path.join(__dirname, '../uploads/productImages',image)
                    fs.unlink(imagePath,(err)=>console.log(err))
    
                });
            }else{
                product.images = product.images.filter(file=> file !== imagesToDelete)
                const imagePath = path.join(__dirname, '../uploads/productImages',imagesToDelete)
                fs.unlink(imagePath,(err)=>console.log(err))
            }
            
            
           
        }
        
        await product.save()
        res.status(200).json('Product Updated Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}

const getProductsByStore = async(req,res)=>{
try{
    const {storeId} = req.params
    const products = await Products.find({store_id:storeId})
    if(!products){
        return res.status(404).json('No Products Found')
    }
    res.status(200).json(products)

}catch(err){
    console.log(err)
    res.status(500).json('Internal Server Error')
}

}

const removeProduct = async(req,res)=>{
    try{
        const {productId} = req.params
        const userId = req.user.id
        const product = await Products.findById(productId).populate('store_id')
        if(product && product.store_id.seller_id.toString()===userId.toString()){
            if(product.images && product.images.length > 0){
                product.images.forEach((image)=>{
            const imagePath = path.join(__dirname, '../uploads/productImages/',image)
            fs.unlink(imagePath, (err)=>{
                console.log(err)
            })
                })
            }
            await product.deleteOne();
          res.status(200).json('Product Removed Successfully')
        }else{
            res.status(404).json('Unauthorized Access or Product not found')
        }


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}


const getAllProducts = async(req,res)=>{
    try{
        const allproducts = await Products.find({status: 'active'}).populate('store_id')
        if(!allproducts){
            return res.status(404).json('No Products Found')
        }
        res.status(200).json(allproducts)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getProductDetails = async(req,res)=>{
    try{
        const {productId} = req.params
        const product = await Products.findById(productId).populate('store_id','store_name').populate('reviews.user','name')
        if(!product){
            return res.status(404).json('Product not Found')
        }
        res.status(200).json(product)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const searchProduct = async(req,res)=>{
    try{
        const {query} = req.query
        const products = await Products.find({
            $or:[
                {name: {$regex: query, $options :'i'}},
                {category: {$regex: query, $options :'i'}}
            ]
        }).populate(' store_id','store_name')
        if(!products){
            return res.status(404).json('No Product Matches Your Search')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const searchByCategory = async (req,res)=>{
    try{
        const {category} = req.params
        const products = await Products.find({category:{ $regex:category, $options: 'i'}}).populate('store_id')
        if(!products){
            return res.status(404).json('No Products Found Under this Category')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const searchByName = async(req,res)=>{
    try{
        const {title} = req.params
        const products = await Products.find({title:{ $regex : title, $options :'i'}}).populate(' store_id','store_name')
        if(!products){
            return res.status(404).json('No Product Found For you Search')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// for seller View only
const getStoreProducts = async(req,res)=>{
    try{
        const {storeId} = req.params
        console.log(storeId)
        const products = await Products.find({store_id:storeId})
        if(!products){
            return res.status(404).json('No Products Found')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}


const addReviews = async(req,res)=>{
    try{
        const userId = req.user.id
        const {productId} = req.params
        const {rating,comments} = req.body
        const product = await Products.findById(productId)
       
        if(!product){
            return res.status(404).json('No Product Found')
        }
      
        const reviews ={
            user :userId,
            rating: Number(rating),
            comments: comments
        }
        product.reviews.push(reviews)
        if (product.reviews.length > 0) {
            product.averageRating = product.reviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / product.reviews.length;
          } else {
            product.averageRating = 0;  // Default if no reviews
          }
        await product.save()
        res.status(200).json('Product review successful')


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}












module.exports = {addProduct,updateProduct,getProductsByStore,removeProduct,getAllProducts,
    searchProduct,searchByCategory,searchByName,getProductDetails,getStoreProducts,addReviews}