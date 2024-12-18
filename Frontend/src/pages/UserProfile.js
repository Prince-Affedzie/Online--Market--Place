import React, { useState, useEffect } from 'react';
import './CustomerProfile.css';
import Header from '../components/Header';
import NavBar from '../components/HomeNavBar';

const Backend = 'http://localhost:3000';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Orders');
  const [wishlist, setWishlist] = useState([]);
  const [settings, setSettings] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Backend}/api/user/getprofile`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true);
      try {
        let url;
        let dataSetter;

        switch (activeTab) {
          case 'Orders':
            url = `${Backend}/api/marketplace/buyer/vieworders`;
            dataSetter = setOrders;
            break;
          case 'Wishlist':
            url = `${Backend}/api/user/wishlist`;
            dataSetter = setWishlist;
            break;
          case 'Settings':
            url = `${Backend}/api/user/settings`;
            dataSetter = setSettings;
            break;
          case 'Reviews':
            url = `${Backend}/api/user/reviews`;
            dataSetter = setReviews;
            break;
          default:
            return;
        }

        const response = await fetch(url, { method: "GET", credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          dataSetter(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTabData();
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="profile-page">
      
      {/* Profile Header */}
      <div className="profile-header">
        <img className="profile-avatar" src="https://via.placeholder.com/150" alt="Profile" />
        <h2>{user.name || 'Loading...'}</h2>
        <h4>{user.email || 'Loading...'}</h4>
        <p>“Love shopping with Prinz Market!”</p>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        {['Orders', 'Wishlist', 'Settings', 'Reviews'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={activeTab === tab ? 'tab active' : 'tab'}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="tab-content">
        {activeTab === 'Orders' && <Orders data={orders} />}
        {activeTab === 'Wishlist' && <Wishlist data={wishlist} />}
        {activeTab === 'Settings' && <Settings data={settings} />}
        {activeTab === 'Reviews' && <Reviews data={reviews} />}
      </div>
    </div>
  );
};

export default UserProfile;

// Individual Components (placeholders)
const Orders = ({ data }) => (
  <div className="orders-container">
    {data.length ? (
      data.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <span className="order-id">Order ID: {order._id}</span>
            <span className="order-date">Date: {new Date(order.date_ordered).toLocaleDateString()}</span>
          </div>

          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span className="product-name">{item.product_id.title}</span>
                <span className="product-quantity">Qty: {item.quantity}</span>
                <span className="product-price">GH₵ {item.price}</span>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="order-status">
              Status: <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="total-price">Total: GH₵ {order.total_amount}</div>
          </div>
        </div>
      ))
    ) : (
      <p>No orders found.</p>
    )}
  </div>
);

const Wishlist = () => <div>Your Wishlist items will appear here.</div>;
const Settings = () => <div>Your account settings can be managed here.</div>;
const Reviews = () => <div>Your product reviews will be shown here.</div>;
