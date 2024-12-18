const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
     store_id:{
        type: Schema.Types.ObjectId,
        ref:'Stores'
     },
     title:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required: true
     },
     price:{
        type:Number,
        required:true

     },
     stock:{
        type:Number,
        default:0,
        

     },
     images:[String],

     category:{
        type:String,
        required:true
     },
    
     subcategory:{
      type: String,
      required:true
     },
     Brand:{
      type:String,  
  },
     quantitySold:{
      type:Number,
      default:0
    },

    offeringDiscount:{
       type:Boolean,
       defaullt: false
    },
    discountAmount:{
        type: Number,
        default:0
    },
    discountPercentage:{
         type : Number,
         default : 0
    },
    discountDuration:{
         type: Date,
         default: null
    },

     reviews:[{
      user:{
         type:Schema.Types.ObjectId,
         ref:'Users'
      },
      rating:{
         type:Number

      },
      comments:{
         type: String
      },
      
      date: {
         type:Date,
         default: Date.now()
      }
     }],
     averageRating:{
          type:Number,
          default:0
     },
     status:{
      type:String,
      required:true,
      enum: ['active','paused'],
      default: 'active'
     },
     date_added:{
        type:Date,
        default:Date.now()
     }


})

const Products = mongoose.model('Products',productSchema)
module.exports = {Products}