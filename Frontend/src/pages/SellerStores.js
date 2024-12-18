// StoresPage.js
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SellerNavbar from '../components/SellerNavbar';
import './SellerStores.css';
const Backend = 'http://localhost:3000'
const StoresPage = () => {
  const navigate = useNavigate()
  const [stores, setStores] = useState([]);
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
  
 const fetchStores = async()=>{
  setLoading(true)
  try{
    const response = await fetch(`${Backend}/api/marketplace/getsellerstores`,{
      method: "GET",
      headers:{
        'content-type':'application/json'
      },
      credentials:"include"
    })
    if(response.ok){
      const data = await response.json()
      setStores(data)
    }

  }catch(err){
    console.log(err)
  }finally{
    setLoading(false)
  }
 }

   fetchStores()
  },[])

  const handleAddStore = () => {
    navigate('/seller/createstore')
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }
  return (
    <div className="stores-page">
      <SellerNavbar/>
      <h2>Your Stores</h2>
      <div className="stores-list">
        {stores.length>0? (stores.map(store => (
          <Link to={`/seller/viewstore/${store._id}`} style={{ textDecoration: 'none' }}>
          <div key={store._id} className="store-card">
            <h3>{store.store_name}</h3>
            {/*<p>{store.store_description}</p>*/}
            {store.store_logo && store.store_logo.length > 0 && (
                    <img
                      style={{ width: '50px', height: '50px' }}
                      src={`http://localhost:3000/uploads/stores/${store.store_logo}`}
                      alt={store.store_name}
                    />
                  )}
          </div>
          </Link>
        ))
      ): (
        <p>No stores found.</p>
      )}
      </div>
        
      <button onClick={handleAddStore} className="add-store-btn">Add Store</button>
    </div>
  );
};

export default StoresPage;
