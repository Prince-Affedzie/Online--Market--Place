// SellerDashboard.js
import React ,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from '../components/NotificationPanel';
import PerformanceChart from '../components/Performance Chart';

import { Line } from 'react-chartjs-2';
import './SellerDashboard.css';
const Backend = 'http://localhost:3000'


// Register Chart.js components

const SellerDashboard = () => {
      const navigate = useNavigate();
      const [storeData,setStoreData] = useState([]);

 /* const storeData = [
    { name: 'Store A', sales: 300, revenue: 10000 },
    { name: 'Store B', sales: 200, revenue: 8000 },
    { name: 'Store C', sales: 150, revenue: 6000 },
  ];*/
 
useEffect(()=>{
  const fetchStoresSales = async ()=>{
    try{
    const response = await fetch(`${Backend}/api/marketplace/seller/getallstoressales`,{
      method:'GET',
      headers:{
        "content-type":"application/json"
      },
      credentials:'include'
    })

    if(response.ok){
      
      const data = await response.json()
      setStoreData(data) 
      console.log(data)
      
      
     
     
    }

  }catch(err){

    console.log(err)}
  }
  fetchStoresSales()
},[])

useEffect(() => {
  if (storeData.length > 0) {
    console.log('Updated storeData:', storeData); // Log the storeData when it's updated
  }
}, [storeData]);
  return (
    <div className="seller-dashboard">
      <div className="dashboard-sidebar">
        <ul>
          <li onClick={() => navigate('/seller/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/seller/stores')}>Stores</li>
          <li onClick={() => navigate('/orders')}>Manage Stores</li>
          <li onClick={() => navigate('/seller/createstore')}>New Store</li>
          <li onClick={() => navigate('/analytics')}>Business Analytics</li>
          <li onClick={() => navigate('/profile')}>Account Settings</li>
          <li onClick={() => navigate('/logout')}>LogOut</li>
        </ul>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
           <NotificationPanel /> 
          <h2>Welcome to Your Seller Dashboard</h2>
          {/* Add the NotificationPanel */}
          <p>Manage your business and stores here.</p>
         
        </div>

        <div className="dashboard-content">
          
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Number Of Stores</h3>
            <p>{storeData.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>150</p>
          </div>
          <div className="stat-card">
            <h3>Products Listed</h3>
            <p>75</p>
          </div>
        </div>

        <div className="dashboard-chart">
          <PerformanceChart storeData={storeData} />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
