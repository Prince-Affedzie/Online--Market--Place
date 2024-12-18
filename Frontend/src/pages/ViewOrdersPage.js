import React, { useState, useEffect } from 'react';
import './ViewOrders.css';
import Footer from '../components/Footer';
import HomeNavBar from '../components/HomeNavBar';
import { FaTimesCircle, FaEye, FaShoppingCart } from 'react-icons/fa';

const Backend = 'http://localhost:3000';

const ViewOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
       setLoading(true)
      try {
        const response = await fetch(`${Backend}/api/marketplace/buyer/vieworders`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)
      }
    };
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/buyer/cancelorder/${orderId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Canceled' } : order));
      }
    } catch (err) {
      console.error('Error canceling order:', err);
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }


  return (
    <div className="view-orders-page">
      <HomeNavBar />
      <h2 className="page-title">Your Orders <FaShoppingCart /></h2>

      {orders && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
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

              <div className="order-actions">
                <button className="view-details-btn" onClick={() => toggleOrderDetails(order._id)}>
                  <FaEye /> View Details
                </button>
                {order.status === 'pending' && (
                  <button className="cancel-order-btn" onClick={() => cancelOrder(order._id)}>
                    <FaTimesCircle /> Cancel Order
                  </button>
                )}
              </div>

              {expandedOrderId === order._id && (
                <div className="order-details-modal">
                  <h3>Order ID: {order._id}</h3>
                  <p><strong>Date:</strong> {new Date(order.date_ordered).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></p>
                  <p><strong>Total:</strong> GH₵ {order.total_amount}</p>
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product_id.title} - {item.quantity} pcs @ GH₵ {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">You haven't placed any orders yet.</p>
      )}

      <Footer />
    </div>
  );
};

export default ViewOrdersPage;
