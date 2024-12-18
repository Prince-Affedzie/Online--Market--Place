const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartItemSchema = new Schema({
    product:{
        type : Schema.Types.ObjectId,
        ref: 'Products',
        required:true

    },
    quantity:{
        type: Number,
        min:1,
        default:1,
        
    }
})

const CartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    items:[CartItemSchema],
    totalPrice:{
        type: Number,
        required:true,
        default:0
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
})
 const Cart = mongoose.model('Cart',CartSchema)

 module.exports = Cart
