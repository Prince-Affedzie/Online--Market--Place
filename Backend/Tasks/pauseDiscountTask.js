const {Products } = require('../Models/ProductsModel')
const  cron = require('node-cron')

const pauseDiscountTask = ()=>{
    cron.schedule('0 * * * *',async ()=>{
        console.log('Running Discount Expiration Checks')
        try{
            const now = new Date()
            await Products.updateMany(
                {
                    offeringDiscount:true,
                    discountDuration:{$lte:now}
                },
                {$set :{offeringDiscount:false}}

            )
            console.log('Discount expiration check complete')

        }catch(err){
            console.log(err)
        }
    })
}

module.exports = {pauseDiscountTask}