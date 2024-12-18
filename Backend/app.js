const express = require("express")
const mongoose = require("mongoose")
const BodyParser = require('body-parser')
const {Stores} = require('./Models/StoresModel')
const {Products} = require('./Models/ProductsModel')
const {Business} = require('./Models/BusinessModel')
const CookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const user_router = require('./Routes/userRoute')
const store_router = require('./Routes/storeRoute')
const  product_router = require('./Routes/productRoute')
const cart_router = require('./Routes/cartRoute')
const authRoute = require('./Routes/AuthRoute')
const order_router = require('./Routes/orderRoutes')
const sales_router = require('./Routes/salesRoute')
const admin_router = require('./Routes/adminRoutes')
const {pauseDiscountTask}  = require('./Tasks/pauseDiscountTask')


const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const app = express()
app.use(CookieParser())
app.use(BodyParser.urlencoded({extended:true}))
app.use(BodyParser.json())
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true,
}))
app.use('/uploads',express.static('uploads'))
app.use('/api',user_router)
app.use('/api',store_router)
app.use('/api',product_router)
app.use('/api',authRoute)
app.use('/api',cart_router)
app.use('/api',order_router)
app.use('/api',sales_router)
app.use('/api',admin_router)

/*const updateProduct = async()=>{
  try{

  await  Products.updateMany(

      {},
      {$set :{discountDuration:null}}
    )
    console.log('Products Updated Successfully')
  }catch(err){
    console.log(err)
  }
}*/


mongoose.connect(MONGODB_URI)
   .then( ()=>app.listen(PORT,()=>{
     console.log('Listening on Port 3000')
    /* updateProduct()*/
    pauseDiscountTask()
     
    
     
    
   }))
   .catch((err)=>{
    console.log(err)
   })

   