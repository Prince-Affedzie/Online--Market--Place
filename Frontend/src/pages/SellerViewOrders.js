// src/pages/SellerViewOrders.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import { FaShippingFast, FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';
import ReactModal from 'react-modal';
import './SellerViewOrders.css';

const Backend = 'http://localhost:3000';

const SellerViewOrders = () => {
  const { storeId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/seller/vieworders/${storeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const orderData = await response.json();
          setOrders(orderData);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [storeId]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="orders-overview">
      <SellerNavbar />
      <header className="orders-header">
        <h1>View Orders</h1>
        <div className="orders-summary">
          <div className="summary-card">
            <FaShippingFast className="summary-icon pending" />
            <h3>Pending Orders</h3>
            <p>{orders.filter(order => order.status === 'pending').length}</p>
          </div>
          <div className="summary-card">
            <FaCheckCircle className="summary-icon completed" />
            <h3>Completed Orders</h3>
            <p>{orders.filter(order => order.status === 'delivered').length}</p>
          </div>
          <div className="summary-card">
            <FaTimesCircle className="summary-icon canceled" />
            <h3>Canceled Orders</h3>
            <p>{orders.filter(order => order.status === 'canceled').length}</p>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <input type="text" placeholder="Search orders..." className="search-input" />
        <button className="search-btn"><FaSearch /></button>
      </div>

      {/* Orders Table */}
      <section className="orders-table-section">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} onClick={() => openModal(order)}>
                <td>{order._id}</td>
                <td>{order.buyer_name}</td>
                <td>{new Date(order.date_ordered).toLocaleDateString()}</td>
                <td><span className={`status-badge-1 ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>GH$ {order.amount}</td>
                <td>
                  <button className="view-btn" onClick={() => openModal(order)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <ReactModal isOpen={isModalOpen} onRequestClose={closeModal} className="order-modal" overlayClassName="modal-overlay">
          <div className="modal-header">
            <h2>Order Details</h2>
            <button className="close-btn" onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            <h3>Order ID: {selectedOrder._id}</h3>
            <p><strong>Customer:</strong> {selectedOrder.buyer_name}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.date_ordered).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
            <p><strong>Total:</strong> GH$ {selectedOrder.amount}</p>
            <h4>Items: </h4>
            <ul>
              {selectedOrder.items.map(item => (
                <li key={item.product_id}>{item.product_id.title} - {item.quantity} pcs</li>
              ))}
            </ul>
          </div>
        </ReactModal>
      )}
    </div>
  );
};

export default SellerViewOrders;
