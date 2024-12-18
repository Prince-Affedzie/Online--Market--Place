const mongoose = require('mongoose')
const Schema = mongoose.Schema

const saleSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref:'Stores'
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Products'
    },
    amount:{
        type:Number
    },
    date:{
        type:Date,
        default: Date.now()
    }
})

const Sale = mongoose.model('Sale',saleSchema)
module.exports = Sale