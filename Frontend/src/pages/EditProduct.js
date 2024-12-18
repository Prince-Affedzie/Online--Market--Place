import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const Backend = 'http://localhost:3000';

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/buyer/getproductdetails/${productId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const product = await response.json();
          setProductData(product);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Handle file input changes (for new images)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) => file.type.startsWith('image/'));
    setNewImages(prevImages => [...prevImages, ...validImages]);
  };

  // Handle removing an image
  const handleRemoveImage = (image) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((img) => img !== image),
    }));
    setImagesToDelete((prevToDelete) => [...prevToDelete, image]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    formData.append('category', productData.category);

    // Append new images
    newImages.forEach(image => {
      formData.append('productImages', image);
    });

    // Append images to delete
    imagesToDelete.forEach(image => {
      formData.append('imagesToDelete', image);
    });

    try {
      const response = await fetch(`${Backend}/api/marketplace/seller/updateproduct/${productId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Product updated successfully');
        alert('Product updated successfully!');
        navigate(`/productdetails/${productId}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={productData.title}
            onChange={(e) => setProductData({ ...productData, title: e.target.value })}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={productData.description}
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          ></textarea>
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            value={productData.price}
            onChange={(e) => setProductData({ ...productData, price: e.target.value })}
          />
        </div>

        <div>
          <label>Stock:</label>
          <input
            type="number"
            value={productData.stock}
            onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            value={productData.category}
            onChange={(e) => setProductData({ ...productData, category: e.target.value })}
          />
        </div>

        <div>
          <label>Current Images:</label>
          <div className="product-images">
            {productData.images.map((image, index) => (
              <div className="image-wrapper" key={index}>
                <img
                  src={`${Backend}/uploads/productImages/${image}`}
                  alt={`product-${index}`}
                  className="product-image"
                />
                <span className="remove-icon" onClick={() => handleRemoveImage(image)}>
                  &times;
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label>Upload New Images:</label>
          <input
            type="file"
            name="productImages"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
