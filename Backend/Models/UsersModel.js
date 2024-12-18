const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name :{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true

    },
    role:{
        type:String,
        enum :['Buyer','Seller'],
        default: 'Buyer'
        
    },
    profileImage:{
       type:String,
       required:false
    },
    store_id:{
        type:Schema.Types.ObjectId,
        ref:'Stores',
        required:false
    },
    address:{
        type:String,
        required:false
    },
    contact_info:{
        type:String,
        required:false
    },
    date_joined:{
        type: Date,
        default:Date.now()
    }


})

const Users = mongoose.model("Users",userSchema)
module.exports = {Users}