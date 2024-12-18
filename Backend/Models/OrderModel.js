const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user:{
      type: Schema.Types.ObjectId,
      ref:'Users',
      required:true
    },
   items :[{
       products:{type: Schema.Types.ObjectId,
        ref:'Products',
        required:true},

        quantity:{
            type: Number,
            required:true
        }
    }],
    totalcost:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        enum:['Processing','Shipped','Delivered','Cancelled'],
        default:'Processing'
    },

    paymentMethod:{
        type:String,
        enum:['Card','PayPal','Bank Transfer','Mobile Money'],
        required:true
    },
    paymentStatus:{
        type: String,
        enum:['Pending','Paid'],
        default:'Pending',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }


})

const Order = mongoose.model('Order',OrderSchema)
module.exports = Order