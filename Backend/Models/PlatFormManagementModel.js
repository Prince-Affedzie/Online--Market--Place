const mongoose = require('mongoose')
const Schema = mongoose.Schema

const platformSchema = new Schema({
    homePageBanners :[{
        type: String,
        default:[]
    }],
    homePageLogo: {
        type: String
    },
    homePageDescription :{
        type : String
    },
    contactPageBanner:{
        type: String
    },
    aboutUsDescription:{
        type: String
    },
    lastUpdated: {
        type:Date,
        default: Date.now()
    }

})

const PlatformManagement = mongoose.model('PlatformManagement',platformSchema)
module.exports = {PlatformManagement}