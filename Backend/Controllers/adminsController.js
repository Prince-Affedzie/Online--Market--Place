const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Users} = require('../Models/UsersModel')
const {Stores} = require('../Models/StoresModel')
const {Products} = require('../Models/ProductsModel')
const {Business} = require('../Models/BusinessModel')
const {Orders} = require('../Models/OrdersModel')
const {PlatformManagement} = require('../Models/PlatFormManagementModel')
const Sale = require('../Models/SalesModel')
const fs = require('fs')
const path = require('path')


const loginAdmin = async(req,res)=>{
    const {email,password} = req.body
    try{
        if(!email || !password){
            return res.status(401).json('Missing Credentials')
        }
        const user = await Users.findOne({email})
        if(user && user.role === "admin"){
         const isPasswordMatch = await bcrypt.compare(password,user.password)
         if(isPasswordMatch){
            const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_ACCESS_TOKEN,{expiresIn:'1d'})
            res.cookies('accessToken',token,{httpOnly:true,sameSite:'strict', secured:false})
            return res.status(200).json('Login Successful')
         }else{
            return res.status(401).json('Invalid email or Password')
         }

        }else{
            return res.status(401).json('Unauthorized Access')
        }

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// Admin Manage Users Controllers
const getAllUsers = async(req,res)=>{
    try{
        const users = await Users.find()
        if(!users){
            return res.status(404).json('No Users Found')
        }
        res.status(200).json(users)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getASingleUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        res.status(200).json(user)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const addUsers = async(req,res)=>{
    try{
        const {name,email,password,phoneNumber,role} = req.body
        if(!name || !email || !password || !phoneNumber || ! role){
            return res.status(403).json('All fields are required')
        }
        const hashedPassword = await bcrypt.hash(password,8)
        const user = new Users({
          name :name,
          email :email,
          role :role,
          phoneNumber: phoneNumber,
          password: hashedPassword
        })
        await user.save()
        res.status(200).json('User Added Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
const manageUser = async(req,res)=>{
    try{
        const {userId} = req.params
        const {name,email,role,phoneNumber,address} = req.body
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role
        user.phoneNumber = phoneNumber || user.phoneNumber
        user.address = address || user.address
        await user.save()
        res.status(200).json('User updated Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const deleteUser = async(req,res)=>{
    try{
        const {userId} = req.body
        const user = await Users.findById(userId)
        if(!user){
            return res.status(404).json('No User Found')
        }
        if(user && user.profileImage){
            const imagePath = path.join(__dirname, '../uploads/profileImages',user.profileImage)
            fs.unlink(imagePath)
        }
        await user.deleteOne()
        return res.status(200).json('User removed Successfully')
       
    

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
//* Admin Manage Store Controllers
const viewAllStores = async(req,res)=>{
     try{
        const stores = await Stores.find().populate('seller_id')
        .populate('store_products')
        if(!stores){
            return res.status(404).json('No Stores Were Found')
        }
        res.status(200).json(stores)

     }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
     }
}
const viewSingleStore = async(req,res)=>{
    try{
        const {storeId} = req.params
        const store = await Stores.findById(storeId).populate('seller_id')
        .populate('store_products')
        if(!store){
            return res.status(404).json('No Store Found')
        }
        res.status(200).json(store)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
const deleteStore = async(req,res)=>{
    try{
        const {storeId} = req.body
        const store = await Stores.findById(storeId).populate('store_products')
        if(!store){
            return res.status(404).json('No Store Found')
        }
        if(store && store.store_products.lenght >0){
            for (const product of store.store_products) {
               const product_item = await Products.findById(product._id)
               if(!product_item){
                return res.status(404).json('No Produt Found')
               }
               if(product_item && product_item.images.length>0){
                product_item.images.forEach((image)=>{
                    const imagePath = path.join(__dirname,'../uploads/productImages',image)
                    fs.unlink(imagePath)
                })

               }
               await product_item.deleteOne()
            }
        }

        await store.deleteOne()
        res.status(200).json('Store Removed Successfully')


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server  Error')
    }
}

const switchStoreStatus = async(req,res)=>{
    try{
        const {storeId,status} = req.body
        const store = await Stores.findById(storeId)
       
        if(!store){
            return res.status(404).json('No Store Found')
        }
        store.store_status = status
        await store.save()
        
        const newProductStatus = status ===  'paused'?'paused':'active'
        
        await Products.updateMany(
            {store_id:storeId},
            {$set :{status: newProductStatus}}
        )
        res.status(200).json('Store Status Updated Successfully')



    }catch(err){
        console.log(err)
        res.status(500).json('Internal  Server Error')
    }

}

const updateStore = async(req,res)=>{
    try{
       const {storeId} = req.params
       const {store_name,store_description,store_category,store_location} = req.body
       const store = await Stores.findById(storeId)
       if(!store){
        return res.status(404).json('No Store Found')
       }
       store.store_name = store_name || store.store_name 
       store.store_description = store_description || store.store_description
       store.store_category = store_category || store.store_category
       store.store_location = store_location || store.store_location

       if(req.files['storeLogo']){
        store.store_logo = req.files['storeLogo'][0].filename
       }

       if(req.files['storeBanner']){
        store.store_banner = req.files['storeBanner'][0].filename
       }
      await store.save()
      res.status(200).json('Store Updated Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}
// Business Controllers For Admins
const viewAllBusiness = async(req,res)=>{
    try{
        const businesses = await Business.find().populate('businessOwner')
        .populate('stores')
        if(!businesses){
            return res.status(404).json('No businesses found')
        }
        res.status(200).json(businesses )

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const viewSingleBusiness = async(req,res)=>{
    try{
        const {businessId} = req.params
        const business = Business.findById(businessId).populate('businessOwner')
        .populate('stores')
        if(!business){
            return res.status(404).json('No Business Found')
        }
        res.status(200).json(business)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const manageBusinessStatus = async(req,res)=>{
    try{
        const {businessId, status} = req.body
        const business = Business.findById(businessId)
        if(!business){
            return res.status(404).json('No Business Found')
        }
        business.businessStatus = status
        await business.save()
      if(status === "suspended" && business.stores.length >0){
       
        await Stores.updateMany(
            {bussinessAccount : business},
           {$set : {store_status:'paused'}}

        )

        const stores = await Stores.find({bussinessAccount:business})
       for (const store of stores) {
          await Products.updateMany(
            {store_id:store._id},
            {$set : {status : 'paused'}}
          )
       }
      }
      res.status(200).json('Store Status Set Successfully')



    }catch(err){
        console.log(err)
    }

}

const deleteBusiness = async(req,res)=>{
    try{
        const {businessId} = req.body
        const business = Business.findById(businessId)
        if(!business){
            return res.status(404).json('No Business Found')
        }
        if(business.stores.length>0){
            await Stores.updateMany(
                {bussinessAccount:business},
                {$set : {store_status : 'paused'}}
            )
            const stores = await Stores.find({bussinessAccount:business})
            for (const store of stores) {
                await Products.deleteMany(
                    {store_id:store._id}
                )
                
            }
        }
        res.status(200).json('Business Account Removed Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}


// Order Controller For Admins
const viewAllOrders = async(req,res)=>{
    try{

      const orders = await Orders.find().populate('buyer_id')
      if(!orders){
        return res.status(404).json('No Orders Found')
      }
      res.status(200).json(orders)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getASingleOrder = async(req,res)=>{
    try{
        const {orderId} = req.params
        const order = await Orders.findById(orderId).populate({
            path : 'items',
              populate:{
               path: 'product_id'
              }
        })
        if(!order){
            return res.status(404).json('No Order Found')
        }
        res.status(200).json(order)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getOrdersOnDailyBasis = async(req,res)=>{
    try{
         const orders = await Orders.aggregate([
    {
        $lookup: {
            from: "products",
            localField: "items.product_id",
            foreignField: "_id",
            as: "productsDetails"
        }
    },
    {
        $group: {
            _id: {
                orderId: "$_id",
                year: { $year: "$date_ordered" },
                month: { $month: "$date_ordered" },
                day: { $dayOfMonth: "$date_ordered" }
            },
            buyer_id: { $first: "$buyer_id" },
            date_ordered: { $first: "$date_ordered" },
            total_amount: {$first: "$total_amount"},
            region: {$first: "$region"},
            shipping_address: {$first : "$shipping_address"},
            status: {$first : "$status"},
            items: { $first: "$items" }, // Collect all items for the order
            productsDetails: { $first: "$productsDetails" } // Collect product details in one array
        }
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1
        }
    }
]);

         res.status(200).json(orders)

            
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }

}

const manageOrderStatus = async(req,res)=>{
    try{
        const {orderId,status} = req.body
        const order = await Orders.findById(orderId)
        if(!order){
            return res.status(404).json('No Order Found')
        }
        order.status = status
        await order.save()
        for (const item of order.items) {
            const store = await Stores.findById(item.store_id) 
            if(!store) continue;
            const storeOrders = store.orders.find((order)=>order._id.toString() === orderId.toString())
            if(storeOrders && storeOrders.status !== status){
                storeOrders.status = status
            }
            await store.save()

           if(status === 'shipped'){

            const product = await Products.findById(item.product_id)
            if(product){
                product.stock -= parseInt(item.quantity)
                product.quantitySold += parseInt(item.quantity)
            }
            await product.save()

            const sales = new Sale({
            store: item.store_id,
            product:item.product_id,
            amount:parseFloat(item.price)*parseInt(item.quantity)
            })
            
    
            await sales.save()
            
           }


        }

      res.status(200).json('Order Status updated successfully')



    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
  }
}

//Products Controller for Admins

const getAllProducts = async(req,res)=>{
    try{
        const products = await Products.find().populate('store_id')
        if(!products){
            return res.status(404).json('No Products Found')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getAsingleProduct = async(req,res)=>{
    try{
        const {productId} = req.params
        const product = await Products.findById(productId).populate('store_id')
        if(!product){
            return res.status(404).json('No Product Found')
        }
        res.status(200).json(product)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getProductsByStore = async(req,res)=>{
    try{
        const {storeId} = req.body
        const products = await Products.find({store_id:storeId})
        if(!products){
            return res.status(404).json('No Products Found for this store')
        }
        res.status(200).json(products)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const manageProductStatus = async(req,res)=>{
    try{
        const {productId,status} = req.body
        const product = await Products.findById(productId)
        if (!product){
            return res.status(404).json('No Product Found')
        }

        product.status = status
        await product.save()
        res.status(200).json('Product Status set successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal server Error')
    }
}

const deleteProduct = async(req,res)=>{
    try{
        const {productId} = req.params
        const product = await Products.findById(productId)
        if(!product){
            return res.status(404).json('Product not found')
        }
        if(product.images && product.images.length>0){
            product.images.forEach((image)=>{
                const imagePath = path.join(__dirname, '../uploads/productImages',image)
                fs.unlink(imagePath)
            })
        }
        await product.deleteOne()

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

// Controllers For Admins to Manage And Update the Platform Interface
const setHomePageElements = async(req,res)=>{
    try{
        
       
        
        const {homePageDescription} = req.body
        const homePageBanners = req.files['homePageBanner']?req.files['homePageBanner'].map(file=>file.filename): []
    
        const homePageLogo =req.files['homePageLogo']? req.files['homePageLogo'][0].filename : null

       const platformMangement = new PlatformManagement({
        homePageDescription:homePageDescription,
        homePageLogo:homePageLogo,
        homePageBanners:homePageBanners
    })

        await  platformMangement.save()
        res.status(200).json('Home Banners Set Successfully')
    }catch(err){
        res.status(500).json('Internal Server Error')
        console.log(err)
    }
    
}

const updateHomePageElements = async(req,res)=>{
    try{
        const {homePageDescription} = req.body
        const platformManagement = await PlatformManagement.findOne()
        console.log(platformManagement)
        console.log(platformManagement.homePageBanners)

        if(req.files['homePageBanner']){
            const homePageBanners = req.files['homePageBanner'].map(file=>file.filename)
           platformManagement.homePageBanners = [...homePageBanners,...platformManagement.homePageBanners ]
        }
        if(req.files['homePageLogo']){
            platformManagement.homePageLogo = req.files['homePageLogo'][0].filename
        }
        platformManagement.homePageDescription = homePageDescription ||  platformManagement.homePageDescription
        await platformManagement.save()
        res.status(200).json('Home Page Set Successfully')

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getElements = async(req,res)=>{
    try{
        const elements = await PlatformManagement.find()
        if(!elements){
            return res.status(404).json('No Element Found')
        }
        res.status(200).json(elements)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const updateCategoryPageBanner = async(req,res)=>{
    try{
        const {pageName} = req.body


    }catch(err){
        res.status(500).json('Internal Server Error')
        console.log(err)
    }
}













module.exports = {viewAllStores,
    viewSingleStore,loginAdmin,
    addUsers,getAllUsers,getASingleUser,manageUser,
    deleteUser,deleteStore,switchStoreStatus,updateStore,viewAllBusiness,
    viewSingleBusiness,manageBusinessStatus,deleteBusiness,viewAllOrders,
    getASingleOrder,getOrdersOnDailyBasis,manageOrderStatus, getAllProducts,
    getAsingleProduct,getProductsByStore,manageProductStatus,deleteProduct, setHomePageElements,updateHomePageElements,
    getElements }