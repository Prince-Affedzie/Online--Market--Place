import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProducts.css';

const Backend = 'http://localhost:3000';

const AddProducts = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubCategory] = useState('');
  const [stock, setStock] = useState('');
  const [productImages, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [preview, setPreview] = useState(false);

  const [subcategories, setSubcategories] = useState([]);

  // Define available subcategories for each main category
  const subcategoryOptions = {
    Electronics: ['TV', 'Laptop', 'Headphones', 'Cameras And Photos','Home Audio','Office Electronics','Audio Equipment'],
    Fashion: ["Men's Fashion", "Women's Fashion", 'Kids Fashion', 'Accessories','Baby Fashion'],
    'Home Appliances': ['Refrigerators', 'Microwave', 'Washing Machine', 'Vacuum Cleaner'],
    'Mobile Phones': ['Smartphones', 'Tablets', 'Phone Accessories'],
    Computing: ['Laptops', 'Desktops', 'Printers', 'Networking Devices','Laptop Accessories','Tablets','Scanners','Computer Accessories'],
    Beauty: ['Make Up', 'Skin Care', 'Hair Care', 'Fragrance','Tools &  Accessories','Foot,Hand & Nail care'],
    SportsOutdoors: ['Fitness', 'Outdoor Gear', 'Sports Equipment'],
    Others :[]

  };

  // Update subcategories when the main category changes
  useEffect(() => {
    if (category) {
      setSubcategories(subcategoryOptions[category] || []);
      setSubCategory(''); // Reset subcategory when category changes
    }
  }, [category]);

  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        alert('Please upload valid image files (JPG, PNG, etc.)');
      }
      return isValid;
    });
    setImages((prevImages) => [...prevImages, ...validImages]);
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      setTags([...tags, e.target.value]);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('price', price);
    formData.append('stock', stock);
    
    if (productImages) {
      productImages.forEach((image) => {
        formData.append('productImages', image);
      });
    }

    try {
      const response = await fetch(`${Backend}/api/marketplace/seller/addproduct/${storeId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        alert('Product created successfully!');
        navigate(`/seller/manageproducts/${storeId}`);
        console.log(data);
      } else {
        alert('Error creating the store. Please try again.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add-product-page">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Price (GH₵):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home Appliances">Home Appliances</option>
            <option value="Mobile Phones">Mobile Phones</option>
            <option value="Computing">Computing</option>
            <option value="Beauty">Beauty</option>
            <option value="SportsOutdoors">Sports & Outdoors</option>
            

          </select>
        </div>

        <div className="form-group">
          <label>Sub Category:</label>
          <select
            value={subcategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            <option value="">Select a Subcategory</option>
            {subcategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Stock Quantity:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <div className="image-preview">
            {productImages.length > 0 &&
              productImages.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`product-img-${index}`}
                  className="preview-img"
                />
              ))}
          </div>
        </div>

        <div className="form-group">
          <label>Tags (Press Enter to Add):</label>
          <input type="text" onKeyDown={handleTagInput} placeholder="Add tags..." />
          <div className="tag-list">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="form-group preview-toggle">
          <input
            type="checkbox"
            checked={preview}
            onChange={() => setPreview(!preview)}
          />
          <label>Preview Product</label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">Add Product</button>
          <button
            type="reset"
            className="reset-button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setPrice('');
              setCategory('');
              setSubCategory('');
              setStock('');
              setImages([]);
              setTags([]);
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {preview && (
        <div className="product-preview">
          <h3>Product Preview</h3>
          <p><strong>Name:</strong> {title}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Price:</strong> GH₵ {price}</p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Subcategory:</strong> {subcategory}</p>
          <p><strong>Stock:</strong> {stock}</p>
          <div className="preview-images">
            {productImages.map((img, index) => (
              <img key={index} src={URL.createObjectURL(img)} alt={`preview-img-${index}`} />
            ))}
          </div>
          <p><strong>Tags:</strong> {tags.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
