const Cart = require('../Models/CartModel')
const {Products} = require('../Models/ProductsModel')


const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Find the product
        const findProduct = await Products.findById(productId);
        if (!findProduct) {
            return res.status(404).json('No Product Found');
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        // If the cart does not exist, create it
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0, // Initialize totalPrice
            });
        }

        // Check if the item is already in the cart
        const itemIndex = cart.items.findIndex((p) => p.product._id.toString() === productId);

        // If the item is already in the cart
        if (itemIndex > -1) {
            // Update the quantity
            cart.items[itemIndex].quantity += 1;
        } else {
            // Create a new item
            const newItem = {
                product: productId,
                quantity: quantity,
            };
            cart.items.push(newItem);
        }

        // Calculate the total price based on current cart items
        cart.totalPrice = 0; // Reset totalPrice before calculation
        for (const item of cart.items) {
            const product = await Products.findById(item.product);
            // Ensure that the product price is valid
            const itemPrice = product ? product.price : 0; // Default to 0 if product is not found
            cart.totalPrice += itemPrice * item.quantity; // Calculate totalPrice
        }

        // Save the cart
        await cart.save();

        // Respond to the client
        res.status(200).json({ message: 'Product Added To Cart Successfully', cart });

    } catch (err) {
        console.error(err);
        res.status(500).json('Internal Server Error');
    }
};



const viewCart = async(req,res)=>{
    try{
        const userId = req.user.id
        const cart = await Cart.find({user:userId}). populate({
        path:  'items.product',
        populate:{
            path: 'store_id'
        }
    })
        if(!cart){
            return res.status(404).json('No Cart Found')
        }
       
        console.log(cart)
        res.status(200).json(cart)


    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}

const removeItemFromCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId } = req.body; // This should refer to the cart item ID, not the product ID
  
      // Find the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json('No Cart Found');
      }
  
      // Find the index of the item in the cart based on the item's _id, not product._id
      const itemIndex = cart.items.findIndex((item) => item._id.toString() === productId);
      if (itemIndex > -1) {
        // If the item is found, update the totalPrice by subtracting the item's price * quantity
        const itemToRemove = cart.items[itemIndex];
        const productPrice = await Products.findById(itemToRemove.product); // Fetch the product price from the Product model
  
        if (productPrice) {
          cart.totalPrice -= itemToRemove.quantity * productPrice.price;
        }
  
        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
  
        // Save the updated cart
        await cart.save();
  
        return res.status(200).json('Product removed from cart successfully');
      } else {
        return res.status(404).json('Item not found in Cart');
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Internal Server Error');
    }
  };
  
const updateCart = async(req,res)=>{
    try{
       const userId = req.user.id
      // console.log(userId)
       const {id,quantity}= req.body
       console.log(req.body)
       const cart = await Cart.findOne({ user: userId})
       if(!cart){
        return res.status(404).json('Cart Not Found')
       }
       console.log(cart)
       const itemIndex = cart? cart.items.findIndex((item)=>item._id.toString()===id):-1
       if(itemIndex>-1){
        cart.items[itemIndex].quantity = quantity
        await cart.save()
        return res.status(200).json('Cart Updated')
       }else{
        return res.status(404).json('Item not found in cart')
       }

    }catch(err){
        console.log(err)
         res.status(500).json('Internal Server Error')

    }
}

module.exports = {addToCart,viewCart, updateCart, removeItemFromCart}
