import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/HomeNavBar';
import Footer from '../components/Footer';
import './CartPage.css';
const Backend = 'http://localhost:3000';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading,setLoading] = useState(false)

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, cartTotal } });
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${Backend}/api/marketplace/buyer/viewcart`, {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const cartData = await response.json();
          const items = cartData[0]?.items || [];
          setCartItems(items);
          calculateCartTotal(items);
        }
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    };
    fetchCart();
  }, []);

  const calculateCartTotal = (items) => {
    if (Array.isArray(items)) {
      const total = items.reduce((acc, item) => {
        const price = item.product.offeringDiscount ? item.product.discountAmount : item.product.price
        return  acc + price * item.quantity}, 0);
      setCartTotal(total);
    } else {
      setCartTotal(0);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    const updatedCart = cartItems.map(item => item._id === id ? { ...item, quantity: parseInt(quantity) } : item);
    setCartItems(updatedCart);
    calculateCartTotal(updatedCart);

    try {
      const updatedItem = updatedCart.find(item => item._id === id);
      await fetch(`${Backend}/api/marketplace/buyer/updatecart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ id: updatedItem._id, quantity: updatedItem.quantity })
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/buyer/removeitem`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        const updatedCart = cartItems.filter(item => item._id !== productId);
        setCartItems(updatedCart);
        calculateCartTotal(updatedCart);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="cart-page">
      <HomeNavbar />
      <div className="cart-content">
        <h1>Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  {item.product.images && item.product.images.length > 0 && (
                    <img
                      src={`http://localhost:3000/uploads/productImages/${item.product.images[0]}`}
                      alt={item.product.title}
                      className="cart-item-image"
                    />
                  )}
                  <div className="cart-item-details">
                    <h3>{item.product.title}</h3>
                    <p className="product-price">GH₵ {item.product.offeringDiscount ? item.discountAmount : item.product.price }</p>
                    <div className="cart-item-actions">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        className="cart-item-quantity"
                      />
                      <button onClick={() => handleRemoveItem(item._id)} className="remove-btn">
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    <p>GH₵ {item.product.offeringDiscount ? (item.product.discountAmount  * item.quantity ): item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Cart Summary</h2>
              <p>Subtotal: <span>GH₵ {cartTotal}</span></p>
              <p>Shipping: <span>GH₵ 5.00</span></p>
              <p>Tax: <span>GH₵ 2.00</span></p>
              <h3>Total: <span>GH₵ {cartTotal + 5 + 2}</span></h3>

              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <Link to="/home" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
