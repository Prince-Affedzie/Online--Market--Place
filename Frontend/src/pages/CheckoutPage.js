import React, { useState } from 'react';
import { Link ,useLocation,useNavigate} from 'react-router-dom';
import './CheckoutPage.css';
import HomeNavbar from '../components/HomeNavBar'
import Footer from '../components/Footer';
import mastercard from '../assets/mastercard.png'
import paypal from '../assets/paypal.png'
import banktransfer from '../assets/Bank Transfer.png'
const Backend = 'http://localhost:3000'



const CheckoutPage = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const {cartItems,cartTotal} = location.state || {};
    console.log( cartItems) 
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('CreditCard');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
   const response = await fetch(`${Backend}/api/marketplace/buyer/placeorder`,{
    method: "POST",
    headers:{
      'content-type':'application/json'
    },
    body: JSON.stringify(shippingDetails),
    credentials:"include"
   })
   if(response.ok){
    alert('Order Placed Successfully')
    navigate('/orders')
   }
  }catch(err){
    console.log(err)
  }
  };

  return (
    <div className="checkout-page">
      <HomeNavbar/>
      <h1>Checkout</h1>

      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
          {cartItems && cartItems.map((item, index) => (
            <li key={item._id}>
              <h4>{item.product.title}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price:GH₵ {item.product.offeringDiscount ? item.product.discountAmount : item.product.price}</p>
            </li>
          ))}
        </ul>
          <div className="order-total">
            <h3>Total:GH₵ {cartTotal}</h3>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="shipping-details">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={shippingDetails.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Region</label>
              <input type="text" name="region" value={shippingDetails.region} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={shippingDetails.postalCode} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={shippingDetails.country} onChange={handleInputChange} required />
            </div>
          </form>
        </div>

        {/* Payment Method */}
       {/* Payment Method */}
<div className="payment-method">
  <h2>Payment Method</h2>
  <div className="payment-options">
    <div
      className={`payment-card ${paymentMethod === 'CreditCard' ? 'selected' : ''}`}
      onClick={() => setPaymentMethod('CreditCard')}
    >
      <img src={mastercard} alt="Credit Card" />
      <span>Credit Card</span>
    </div>
    <div
      className={`payment-card ${paymentMethod === 'PayPal' ? 'selected' : ''}`}
      onClick={() => setPaymentMethod('PayPal')}
    >
      <img src={paypal} alt="PayPal" />
      <span>PayPal</span>
    </div>
    <div
      className={`payment-card ${paymentMethod === 'BankTransfer' ? 'selected' : ''}`}
      onClick={() => setPaymentMethod('BankTransfer')}
    >
      <img src={banktransfer} alt="Bank Transfer" />
      <span>Bank Transfer</span>
    </div>
  </div>
</div>


        {/* Place Order */}
        <div className="place-order">
          <button onClick={handleSubmit} className="place-order-btn">
            Place Order
          </button>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default CheckoutPage;
