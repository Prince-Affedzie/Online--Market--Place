import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import './singleStore.css'; // Store-specific styling

const Backend = 'http://localhost:3000';

const Store = () => {
  const { storeId } = useParams(); // Store ID from the URL
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch store details and products from API
    const fetchStoreDetails = async () => {
      try {
        const storeResponse = await fetch(`${Backend}/api/marketplace/getstoredetails/${storeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          setStore(storeData);
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="store-page">
      {/* Store Header */}
      <HomeNavBar />
      <div className="store-header">
        {store && (
          <>
            {store.store_banner && (
              <div className="store-banner-container">
                <img
                  className="store-banner"
                  src={`http://localhost:3000/uploads/stores/${store.store_banner}`}
                  alt={`${store.store_name} Banner`}
                />
              </div>
            )}

            {/* Center the logo below the banner */}
            <div className="store-logo-container">
              {store.store_logo && (
                <img
                  className="store-logo1"
                  src={`http://localhost:3000/uploads/stores/${store.store_logo}`}
                  alt={`${store.store_name} Logo`}
                />
              )}
            </div>

            <div className="store-info">
              <h1 className="store-name">{store.store_name}</h1>
              <p className="store-description">{store.store_description}</p>
            </div>
          </>
        )}
      </div>

      {/* Store Products */}
      <div className="store-products">
        <h2 className="products-heading">Our Products</h2>
        <div className="product-grid-1">
          {store.store_products && store.store_products.length > 0 ? (
            store.store_products.map((product) => (
              <Link to={`/productdetails/${product._id}`} key={product._id} style={{ textDecoration: 'none' }}>
                <div className="product-item">
                  <img
                    src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                    alt={product.title}
                    className="product-image"
                  />
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">GH₵ {product.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No products available for this store.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
