// src/pages/SellerStoreOverview.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import { Line } from 'react-chartjs-2';
import './SellerStoreOverview.css';

const Backend = 'http://localhost:3000';

const SellerStoreOverview = () => {
  const { storeId } = useParams(); // Store ID from the URL
  const [store, setStore] = useState(null);
  const [salesData, setSalesData] = useState()
  const [salesCount,setSalesCount] = useState()
  const [totalSales,setTotalSales] = useState()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch store details from API
    const fetchStoreDetails = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/storeoverview/${storeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const storeData = await response.json();
          setStore(storeData);
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
      }
    };

   const fetchSales = async()=>{
    try{
      const response = await fetch(`${Backend}/api/marketplace/seller/getsinglestoresales/${storeId}`,{
        method: 'GET',
        credentials:'include'
      })
      if(response.ok){
        const salesData = await response.json();
       
        processSalesData(salesData);
        console.log(salesData)
        const totalSales= salesData.reduce((sum,current)=>sum + parseFloat(current.totalSales),0)
        const salesCount = salesData.reduce((sum,current)=>sum + parseFloat(current.salesCount),0)
       
        setTotalSales(totalSales)
        setSalesCount( salesCount)
      }

    }catch(err){
      console.log(err)
    }
   }
   Promise.all([ fetchStoreDetails(), fetchSales()]).finally(() => {
    setLoading(false); // Set loading to false once both API calls are done
  });
   
  }, [storeId]);

 

  const processSalesData = (data) => {
    const labels = data.map(item => `${item._id.month}/${item._id.year}`);  
    const salesValues = data.map(item => item.totalSales);
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Sales (GH$)',
          data: salesValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          tension: 0.4,
        },
      ],
    };

    setSalesData(chartData);
  };


  const salesOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  if (loading|| !salesData) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="store-overview">
      <SellerNavbar/>
      <header className="store-header">
        {store && (
          <>
            {store.store_logo && (
              <img
                className="store-logo"
                src={`http://localhost:3000/uploads/stores/${store.store_logo}`}
                alt={`${store.store_name} Logo`}
              />
            )}
            <h1 className="store-name">{store.store_name}</h1>
            <nav className="store-nav">
              <Link to={`/seller/manageproducts/${storeId}`}>Manage Products</Link>
              <Link to={`/seller/vieworders/${storeId}`}>View Orders</Link>
              <Link to={`/seller/updatestore/${storeId}`}>Edit Store</Link>
            </nav>
          </>
        )}
      </header>

      {/* Store Stats Section */}
      <section className="store-stats">
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon"><i className="fas fa-box"></i></span>
            <h3>Total Products</h3>
            <p>{store.store_products.length || 0}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><i className="fas fa-dollar-sign"></i></span>
            <h3>Total Sales</h3>
            <p>GH$ { totalSales || 0}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><i className="fas fa-dollar-sign"></i></span>
            <h3>Number of Sales</h3>
            <p>{ salesCount || 0}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><i className="fas fa-star"></i></span>
            <h3>Customer Ratings</h3>
            <p>{store.customer_ratings || 'N/A'}</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><i className="fas fa-shopping-cart"></i></span>
            <h3>Total Orders</h3>
            <p>{store.orders.length || 0}</p>
          </div>
        </div>
      </section>

      {/* Sales Graph Section */}
      <section className="sales-graph">
        <h2>Sales Overview</h2>
        <div className="graph-container">
          <Line data={salesData} options={salesOptions} />
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <p>No recent activity.</p> {/* Update this with dynamic data */}
        </div>
      </section>
    </div>
  );
};

export default SellerStoreOverview;
