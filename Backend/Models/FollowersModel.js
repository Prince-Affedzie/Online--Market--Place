const mongoose = require('mongoose')
const Schema = mongoose.Schema

const followersSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },
    store_id:{
        type : Schema.Types.ObjectId,
        ref:"Stores"
    },
    date_followed:{
        type: Date,
        default : Date.now()
    }

})

const Followers = mongoose.model("Followers",followersSchema)
module.exports = {Followers}