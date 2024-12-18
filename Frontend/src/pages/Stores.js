import React, { useEffect, useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import './Stores.css';
import HomeNavBar from '../components/HomeNavBar';
import { ProductsContext } from '../Context/ProductsViewContext';
import Footer from '../components/Footer';

const Backend = 'http://localhost:3000';

const Stores = () => {
  const {stores,fetchStores,loading} = useContext(ProductsContext)
 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  
  const [groupedStores, setGroupedStores] = useState({}); // To group stores by category

  useEffect(() => {
   /* const fetchStores = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/getallstores`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setStores(data);
          setFilteredStores(data); // Initially show all stores

          // Group stores by category
          const grouped = data.reduce((acc, store) => {
            const category = store.store_category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(store);
            return acc;
          }, {});
          setGroupedStores(grouped);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setLoading(false);
      }
    };*/

    fetchStores();
  }, []);
  useEffect(()=>{
     // Group stores by category
     const grouped = stores.reduce((acc, store) => {
      const category = store.store_category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(store);
      return acc;
    }, {});
    setGroupedStores(grouped);
  
  },[stores])

  // Handle search input and filter stores
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = stores.filter(store =>
      store.store_name.toLowerCase().includes(value)
    );
    setFilteredStores(filtered);

    // Also group filtered stores by category
    const grouped = filtered.reduce((acc, store) => {
      const category = store.store_category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(store);
      return acc;
    }, {});
    setGroupedStores(grouped);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="stores-page">
      <HomeNavBar />

      <div className="stores-header">
        <h1>Available Stores</h1>

        {/* Search Input */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for stores..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Grouped Stores by Category */}
      {Object.keys(groupedStores).length > 0 ? (
        Object.keys(groupedStores).map((category) => (
          <div key={category} className="store-category-section">
            <h2>{category}</h2>
            <div className="stores-grid">
              {groupedStores[category].map((store) => (
                <div className="store-card" key={store._id}>
                  <div className="store-image">
                    <img
                      src={`http://localhost:3000/uploads/stores/${store.store_logo}`}
                      alt={store.store_name}
                    />
                  </div>
                  <div className="store-details">
                    <h3>{store.store_name}</h3>
                    <p>{store.store_category}</p>
                    <Link to={`/storedetails/${store._id}`} className="view-store-btn">
                      Visit Store
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No stores found.</p>
      )}

      <Footer />
    </div>
  );
};

export default Stores;
