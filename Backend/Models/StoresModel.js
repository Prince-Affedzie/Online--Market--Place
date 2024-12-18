const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema = new Schema({
    seller_id:{
        type:Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    bussinessAccount:{
        type: Schema.Types.ObjectId,
        ref:'Business',
        
    },
    store_name:{
        type: String,
        required:true
    },
    store_description:{
        type:String,
        required:true
    },
    store_logo:{
        type:String,
        required:true
    },
    store_banner:{
        type:String,
        required: true
    },
    store_category:{
        type:String,
        required:true
    },
    store_location:{
        type:String,
        requiired:true
    },
    store_products:[{
        type: Schema.Types.ObjectId,
        ref:'Products'
    }],
    store_ratings:{
         type:Number,
         required:false
    },
    store_status:{
      type: String,
      required: true,
      enum: ['active','paused'],
      default:'active'

    },
    customers:[{

     customer:{
        type: Schema.Types.ObjectId,
        ref:'Users'
    },
    score:{
        type:Number,
        default:1
    }

}],
orders:[{
    items:[{
        product_id:{
            type: Schema.Types.ObjectId,
            ref:'Products',
            required:true
         },
         store_id:{
             type: Schema.Types.ObjectId,
             required:true
 
         },
         quantity:{
             type:Number,
             required:true
 
         }, 
         price:{
             type:Number,
             required: true
 
         }
    }],
    _id:{
        type: Schema.Types.ObjectId,
        ref:'Orders',
        required:true
    },
    amount: { type: Number, required: true }, 
    status:{
        type:String,
         enum:["pending","shipped","delivered","canceled"],
        default:"pending"
    
    },
    buyer_id:{
        type: Schema.Types.ObjectId,
        ref:'Users'
    },
    buyer_name:{
        type:String,
        required:true
    },

     country:{
        type:String
    },
     region:{
         type:String,
        required:true 
    },
     city:{
        type:String,
        required:true
    },

     shipping_address:{
        type:String,
        required:true
    },

    postal_code:{
        type:String 
    },

    payment_status:{
    type:String,
     enum:["pending","complete"],
     default:"pending"},
    date_ordered:{
   type:Date,
    default: Date.now()}
           
}],
    date_created:{
        type:Date,
        default: Date.now()
    }
})


const Stores = mongoose.model("Stores",storeSchema)
module.exports = {Stores}