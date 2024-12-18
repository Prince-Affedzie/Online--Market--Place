// src/pages/UpdateStorePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateStore.css';

const Backend = 'http://localhost:3000';

const UpdateStorePage = () => {
  const { storeId } = useParams();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeBanner, setStoreBanner] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch current store details (if needed for prefilling fields)
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/storeoverview/${storeId}`,{
          method:'GET',
          credentials:'include'
        }
        );
        if (response.ok) {
          const data = await response.json();
          setStoreName(data.store_name);
          setStoreDescription(data.store_description);
          setStoreCategory(data.store_category);
          setStoreLocation(data.store_location);

          // You may want to set preview images for existing logo/banner here
          setLogoPreview(`${Backend}/uploads/stores/${data.store_logo}`);
          setBannerPreview(`${Backend}/uploads/stores/${data.store_banner}`);
        } else {
          console.error('Failed to fetch store data');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleLogoChange = (e) => {
    setStoreLogo(e.target.files[0]);
    setLogoPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleBannerChange = (e) => {
    setStoreBanner(e.target.files[0]);
    setBannerPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('store_name', storeName);
    formData.append('store_description', storeDescription);
    formData.append('store_category', storeCategory);
    formData.append('store_location', storeLocation);
    
    if (storeLogo) {
      formData.append('storeLogo', storeLogo);
    }
    if (storeBanner) {
      formData.append('storeBanner', storeBanner);
    }

    try {
      const response = await fetch(`${Backend}/api/marketplace/updatestore/${storeId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('Store updated successfully!');
        navigate(`/seller/viewstore/${storeId}`);
      } else {
        alert('Error updating the store. Please try again.');
      }
    } catch (error) {
      console.error('Error updating the store:', error);
      alert('Error updating the store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-store-page">
      <h1>Update Your Store</h1>
      <form onSubmit={handleSubmit} className="store-form">
        <div className="form-group">
          <label htmlFor="storeName">Store Name</label>
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeDescription">Store Description</label>
          <textarea
            id="storeDescription"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeCategory">Store Category</label>
          <input
            type="text"
            id="storeCategory"
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeLocation">Store Location</label>
          <input
            type="text"
            id="storeLocation"
            value={storeLocation}
            onChange={(e) => setStoreLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeBanner">Store Banner</label>
          <input
            type="file"
            id="storeBanner"
            accept="image/*"
            onChange={handleBannerChange}
          />
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Store Banner Preview"
              className="preview-image"
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="storeLogo">Store Logo</label>
          <input
            type="file"
            id="storeLogo"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Store Logo Preview"
              className="preview-image"
            />
          )}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating Store...' : 'Update Store'}
        </button>
      </form>
    </div>
  );
};

export default UpdateStorePage;
