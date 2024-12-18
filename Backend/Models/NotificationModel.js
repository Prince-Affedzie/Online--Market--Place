const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notificationSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    message:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now()
    }
})

const Notification = mongoose.model('Notification',notificationSchema)
module.exports = Notification