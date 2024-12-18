const Sale = require('../Models/SalesModel')
const {Stores} = require('../Models/StoresModel')
const { ObjectId } = require('mongodb')

const getStoreSales = async(req,res)=>{
    try{
        const userId = req.user.id
        const {storeId} = req.params
        const store = await Stores.findById(storeId)
        if(store && store.seller_id.toString()===userId.toString()){
         
         const sales = await Sale.aggregate([
            
              { $match:{
                    store:new ObjectId(storeId)
                }
            },
              {  $group:{
                    _id:{
                        year:{$year :"$date"},
                        month:{$month : "$date"}
                    },

                totalSales:{ $sum : "$amount"},
                salesCount:{ $sum: 1}
                }},
            {
                $sort:{
                    "_id.year":1,"_id.month":1
                }
            }
                
            
         ])
         if(!sales){
            return res.status(404).json('No Sales Found')
         }
         
         res.status(200).json(sales)
    
    }else{
        return res.status(404).json('Could not find Store')
    }
        
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const getAllStoresSales = async(req,res)=>{
    try{
        const userId = req.user.id
        const stores = await Stores.find({seller_id:userId})
        if(!stores){
            return res.status(404).json('No Stores Found')
        }
        const sales = await Promise.all(stores.map(async(store)=>{
         const sale = await Sale.find({store:store._id})
         const totalSales = sale.length>0? sale.length: 0
         const revenue =sale.length>0? sale.reduce((sum,saleItem)=>sum + parseFloat(saleItem.amount),0):0
         return {store,totalSales,revenue}
        }))
        console.log(sales)
        res.status(200).json(sales)
    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

module.exports ={getAllStoresSales,getStoreSales}