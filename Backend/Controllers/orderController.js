const {Orders} = require('../Models/OrdersModel')
const {Stores} = require('../Models/StoresModel')
const Cart  = require('../Models/CartModel')
const Sale = require('../Models/SalesModel')
const {ObjectId} = require('mongodb')

const { default: mongoose } = require('mongoose')


const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, city, region, postalCode, country } = req.body;

        // Find the user's cart and populate the products
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json('No cart found');
        }

        // Map the cart items to order items
        const orderItems = cart.items.map((item) => {
            const { product, quantity } = item;
            return {
                product_id: product._id,
                store_id: product.store_id,
                quantity,
                price: product.price,
                offeringDiscount : product.offeringDiscount,
                discountAmount : product.discountAmount
            };
        });

        // Calculate total amount for the entire order
        const total_amount = orderItems.reduce((total, item) => {
            console.log(item)
            const price = item.offeringDiscount ? parseFloat(item.discountAmount) : parseFloat(item.price)
            console.log(price)
            //const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity);
            return total + (price * quantity);
        }, 0);

        // Create the main order for the user
        const order = new Orders({
            buyer_id: userId,
            buyer_name: name,
            items: orderItems, // All items
            total_amount: parseInt(total_amount),
            country: country,
            shipping_address: address,
            city: city,
            region: region,
            postal_code: postalCode,
        });

       // console.log('OrderItems', orderItems);  // Debugging output

        // Group items by store_id
        const groupedItemsByStore = {};
        orderItems.forEach((item) => {
            if (!groupedItemsByStore[item.store_id]) {
                groupedItemsByStore[item.store_id] = [];
            }
            groupedItemsByStore[item.store_id].push(item);
        });

        // Save orders for each store
        await Promise.all(Object.keys(groupedItemsByStore).map(async (storeId) => {
            const store = await Stores.findById(storeId);
            if (!store.orders) {
                store.orders = [];
            }

            // Prepare the new store-specific order
            const newOrder = {
                _id: order._id,
                buyer_id: userId,
                buyer_name: name,
                country: country,
                region: region,
                city: city,
                shipping_address: address,
                postal_code: postalCode,
                items: groupedItemsByStore[storeId],  // Only the items for this store
                amount: groupedItemsByStore[storeId].reduce((sum, i) => {
                    const price = i.offeringDiscount ? i.discountAmount : i.price
                   return sum + parseFloat(price) * parseInt(i.quantity)}, 0) 
            };

            //console.log('New Order for Store:', newOrder);  // Debugging output

            // Add the new order to the store's orders array
            store.orders.push(newOrder);
           // console.log('Store Orders Before Saving:', store.orders);  // Debugging output
            const customer = store.customers.find((customer)=>customer.toString() ===newOrder.buyer_id.toString())
            if(customer){
                customer.score += 1
            }else{
                store.customers.push({customer:newOrder.buyer_id,score:1})
            }

            

            // Save the store with the new order
            await store.save();
        }));

        

        // Save the main order and delete the user's cart
        await order.save();
        await cart.deleteOne();

        // Return success response
        res.status(200).json('Order placed successfully');
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json('Internal Server Error');
    }
};


const viewOrder = async(req,res)=>{
    try{
        const userId  = req.user.id
        const order  = await Orders.find({ buyer_id:userId}).populate({
          path:  'items',
          populate:{
            path:'product_id'
          }
        })
        if(!order){
            return res.status(404).json('You have no Orders')
        }

        res.status(200).json(order)


    }catch(err){
        res.status(500).json('Internal Server Error')
        console.log(err)
    }
}


const sellerViewOrders = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;

        // Check if storeId is a valid ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({ error: 'Invalid Store ID' });
        }

        // Find the store and check if it belongs to the user
        const store = await Stores.findById(storeId).populate('orders.items.product_id');
        if (!store || store.seller_id.toString() !== userId.toString()) {
            return res.status(404).json('No store found or unauthorized access');
        }

        const storeOrders = store.orders

        

        // Log the orders for debugging
        //console.log(JSON.stringify(orders, null, 2));

        // Modify the store_id inside each order's items array if needed
        /*const storeOrders = orders.map(order => {
            order.items = order.items.map(item => {
                if (item.store_id.toString() === storeId) {
                    item.store_id = storeId; 
                    return  item // Ensure the store_id is consistent
                }else{
                   
                }
                
            });
            return order;
        });*/

        // Send back the modified orders
        res.status(200).json(storeOrders);

    } catch (err) {
        console.error('Error fetching store orders:', err);
        res.status(500).json('Internal Server Error');
    }
};

const cancelOrder = async(req,res)=>{
    try{
        const {orderId} = req.params
        const order = await Orders.findById(orderId)
        if(! order){
            return res.status(404).json('No Order Found')
        }
      /* await Promise.all(order.items.map(async(item)=>{
            const sales = await Sale.find({product:item.product_id})
            console.log(sales)
            await sales.deleteOne()
        })) */
        order.items.forEach(async(item)=>{
            const store = await Stores.findById(item.store_id)
            console.log(store)
           store.orders.forEach((order)=>{
            if(order._id.toString() ===orderId){
              
              order.status = 'canceled'

            }
           })
           await store.save()
        })
        
      
        await order.deleteOne()
        res.status(200).json('Order deleted Successfully')

    }catch(err){
        res.status(500).json('Internal Server Error')
        console.log(err)
    }
}

module.exports = {placeOrder,viewOrder,sellerViewOrders,cancelOrder}