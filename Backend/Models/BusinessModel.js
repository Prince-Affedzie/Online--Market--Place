const mongoose = require('mongoose')
const Schema = mongoose.Schema

const businessSchema = new Schema({
    businessName:{
        type:String,
        required:true
    },
    typeOfBusiness:{
        type: String,
        enum:['Individual','Partnership','Corporation'],
        required:true
    }, 
    bussinessAddress:{
        type:String,
        required:true
    },
    nationalId:{
        type: String,
        required:true
    },
    IdNumber:{
      type: String,
      required: true
    },
    bankName:{
        type: String,
        required:true
    },
    bankAccountNumber:{
        type: String,
        required:true
    },
    stores:[{
        type : Schema.Types.ObjectId,
        ref: "Stores",
        default: []

    }],
    businessOwner:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    businessStatus:{
        type:String,
        required:true,
        enum: ['pending','approved','rejected','suspended'],
        default : 'pending'

    }

    
})

const Business = mongoose.model('Business',businessSchema)
module.exports = {Business}