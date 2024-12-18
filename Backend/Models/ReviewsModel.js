const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewsSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    store_id:{
        type:Schema.Types.ObjectId,
        ref: "Stores"
    },
    product_id:{
        type: Schema.Types.ObjectId,
        ref:"Products"
    },
    rating:{
        type:Number,
        required:false   
    },
    comment:{
        type:String,
        required:false
    },
    date_reviewed:{
        type:Date,
        default: Date.now()
    }


})

const Reviews = mongoose.model("Reviews",reviewsSchema)
module.exports = {Reviews}