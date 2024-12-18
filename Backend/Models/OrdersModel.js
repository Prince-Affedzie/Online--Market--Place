const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const orderSchema = new Schema({
    buyer_id:{
        type: Schema.Types.ObjectId,
        ref:'Users'
    },
    buyer_name:{
            type:String,
            required:true
    },
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

    total_amount:{
        type: Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","shipped","delivered","canceled"],
        default:"pending"
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
        default:"pending"

    },
    date_ordered:{
        type:Date,
        default: Date.now()

    }

})

const Orders = mongoose.model('Orders',orderSchema)
module.exports = {Orders}