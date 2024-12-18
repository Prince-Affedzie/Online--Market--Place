// src/pages/CreateStorePage.js
import React, { useState } from 'react';
import { useActionData, useNavigate } from 'react-router-dom';
import './createStore.css';

const Backend = 'http://localhost:3000';

const CreateStorePage = () => {
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeCategory,setStoreCategory] = useState('')
  const [storeLocation, setstoreLocation] = useState('')
  const [storeLogo, setStoreLogo] = useState(null);
  const [storeBanner, setstoreBanner] = useState(null)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    setStoreLogo(e.target.files[0]); // Get the selected file
  };
  
  const handleBannerChange = (e) => {
    setstoreBanner(e.target.files[0]); // Get the selected file
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
      formData.append('storeLogo', storeLogo); // Append the logo file
    }
    if (storeBanner) {
        formData.append('storeBanner', storeBanner); // Append the logo file
      }

    try {
      const response = await fetch(`${Backend}/api/marketplace/createstore`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Store created successfully!');
        navigate(`/seller/viewstore/${data.store_id}`); // Navigate to the new store page
      } else {
        alert('Error creating the store. Please try again.');
      }
    } catch (error) {
      console.error('Error creating the store:', error);
      alert('Error creating the store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-store-page">
      <h1>Create Your Store</h1>
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
            onChange={(e) =>setstoreLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeBanner">Store Banner</label>
          <input
            type="file"
            id="storeBanner"
            accept="image/*"
            onChange={ handleBannerChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeLogo">Store Logo</label>
          <input
            type="file"
            id="storeLogo"
            accept="image/*"
            onChange={handleLogoChange}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Store...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStorePage;
