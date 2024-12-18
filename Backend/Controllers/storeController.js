const {Stores}= require("../Models/StoresModel")
const {Products} = require('../Models/ProductsModel')
const {Business} = require('../Models/BusinessModel')
const {Users} = require('../Models/UsersModel')

const sell = async(req,res)=>{
     const  {businessName, businessType, address, nationalId,idNumber,bankName,bankAccountNumber} = req.body
    try{
    const userId = req.user.id
    const user = await Users.findById(userId)
    if(!user){
        return res.status(404).json('Account Not Found')
    }
    if(user.role==="Seller"){
        return res.status(403).json('You Already have a Selling Account')
    }

    const business = new Business({
        businessName:businessName,
        typeOfBusiness : businessType,
        bussinessAddress : address,
        nationalId:nationalId,
        IdNumber:idNumber,
        bankName:bankName,
        bankAccountNumber: bankAccountNumber,
        businessOwner : userId

    })
    await business.save()
    user.role = "Seller"
    await user.save()
    res.status(200).json('Bussiness Account Created Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const createStore = async(req,res)=>{
    try{
        const userId = req.user.id
        const storeLogo = req.files['storeLogo'] ? req.files['storeLogo'][0].filename: null
        const storeBanner = req.files['storeBanner'] ? req.files['storeBanner'][0].filename: null
        const {store_name,store_description,
            store_category,store_location
        } =req.body

        const business = await Business.findOne({businessOwner: userId})
        if(!business || business.businessStatus !== "approved"){
            return res.status(403).json('Forbidden')
        }

        const newStore = new Stores({
            seller_id:userId,
            bussinessAccount:business,
            store_name:store_name,
            store_description:store_description,
            store_logo:storeLogo,
            store_banner:storeBanner,
            store_category: store_category,
            store_location:store_location
        })
        business.stores = [...business.stores,...newStore]
        await business.save()
        await newStore.save()
        res.status(200).json('Store Created Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}
// customers View
const getStore = async(req,res)=>{
    try{
    const {storeId} = req.params
    console.log(storeId)
    const store = await Stores.findById(storeId).populate('store_products')
    console.log(store)
    if(!store){
        return res.status(404).json('No Store Found')
    }else{
    res.status(200).json(store)}
    }catch(err){
        console.log(err)
        res.status(500).json('Internal server error')
    }

   


}

const updateStore = async(req,res)=>{
    try{
    const userId = req.user.id
    const {storeId} = req.params
    console.log(req.body)
    const {store_name,store_description,store_category,store_location} = req.body


   const store = await Stores.findById(storeId)
   if(store && store.seller_id.toString() === userId.toString()){
    store.store_name = store_name || store.store_name,
    store.store_description = store_description || store.store_description,
    store.store_category = store_category ||store.store_category,
    store.store_location = store_location ||store.store_location
    console.log(req.files)
    if (req.files['storeLogo']) {
        store.store_logo = req.files['storeLogo'][0].filename;
      }
      if (req.files['storeBanner']) {
        store.store_banner = req.files['storeBanner'][0].filename;
      }

    await store.save()
    res.status(200).json('Store Updated Successfully')
   }
   else{
    res.status(404).json("Store not found")
   }
    }catch(err){
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}

const deleteStore = async(req,res)=>{
    try{
        const {storeId} = req.params
        const userId = req.user.id
        const store = await Stores.findById(storeId).populate('Products')
        if(store && store.seller_id.toString()===userId.toString()){
          for(const product of store.Products){
             await Products.findByIdAndDelete(product._id)
          }
         await store.deleteOne()
         
         return res.status(200).json('Store removed Successfully')
        }else{
            return res.status(404).send('Store not found or Unauthorized Access')

        }

    }catch(err){

    }
}
// Customers View
const getAllStores = async (req,res)=>{
    try{
        const stores = await Stores.find()
        if(!stores){
            return res.status(404).json('No Stores Found')
        }
        console.log(stores)
        res.status(200).json(stores)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getStoreByName = async(req,res)=>{
    try{
        const {storeName} = req.params
        //Using regex for case-insensitive and partial matching
        const store = await Stores.find({store_name:{ $regex : storeName , $options : 'i'}})
        if(!store){
            return res.status(404).json('No Store Found')
        }
        res.status(200).json(store)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// Buyer Routes
const getStoreDetails = async(req,res)=>{
    try{
        const {storeId} = req.params
        const store = await Stores.findById(storeId).populate('store_products')
        if(!store){
            return res.status(404).json('Store Not Found')
        }
        res.status(200).json(store)

    }catch(err){
        console.log(err)
        return res.status(500).json('Internal Server Error')
    }
}


const getSellerStores = async(req,res)=>{
     try{
       
       const userId = req.user.id
      
       const stores = await Stores.find({seller_id:userId})
       if(!stores){
        return res.status(404).json('No Stores Found')
       }
      
       res.status(200).json(stores)

     }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
     }
}

const sellerGetStore =async(req,res)=>{
    try{
        
       const {storeId} = req.params
       const userId = req.user.id
       const store = await Stores.findById(storeId).populate('store_products')
       if(store && store.seller_id.toString()===userId.toString()){
        return res.status(200).json(store)
        }
       else(
        res.status(404).json('Store Not Found Or Unauthorized Access')
       )

     }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
     }
}

const runDiscount = async(req,res)=>{
    try{

        const {productId} = req.params
        console.log(req.body)
        const {discountAmount,discountDuration} = req.body

        const product = await Products.findById(productId)
        if(!product){
            return res.status(404).json('Product not found')
        }
        const discountPercentage = ((product.price - parseFloat(discountAmount))/product.price)*100
        product.offeringDiscount = true
        product.discountAmount = discountAmount
        product.discountDuration = new Date(discountDuration) 
        product.discountPercentage = discountPercentage
        await product.save()
        res.status(200).json('Discount set successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const endDiscount = async(req,res)=>{
    try{
        const {productId} = req.params
        const product = await Products.findById(productId)
        if(!product){
            return res.status(404).json("Product not found")
        }
        product.offeringDiscount = false
        product.discountAmount = 0
        product.discountPercentage = 0
        product.discountDuration = null
        await product.save()

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}



module.exports={sell,sellerGetStore,createStore,getStore,updateStore,deleteStore,getAllStores
    ,getStoreByName,getStoreDetails,getSellerStores,runDiscount,endDiscount }