import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import Footer from '../components/Footer';
import { ProductsContext } from '../Context/ProductsViewContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductsCategoryPage.css';

const Backend = 'http://localhost:3000';

const ProductsCategoryPage = () => {
  const { stores } = useContext(ProductsContext);
  const { category } = useParams();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      try {
        const response = await fetch(`${Backend}/api/marketplace/buyer/getbycategory/${category}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    // Group products by subcategory
    const grouped = products.reduce((acc, product) => {
      const subcategory = product.subcategory || 'Others';
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(product);
      return acc;
    }, {});
    setGroupedProducts(grouped);
  }, [products]);

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/buyer/addtocart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Product Added to Cart!');
      } else {
        console.error('Failed to add product to cart:', response.statusText);
        toast.error('Failed to add product to cart.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  if (loadingProducts) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="products-page">
      <ToastContainer />
      <h2>{category}</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search Products..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="filter-options">
          <label>Sort by:</label>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {Object.keys(groupedProducts).map((subcategory) => (
        <div key={subcategory} className="subcategory-section">
          <div className="category-header-h">
          <h3 className="subcategory-title">{subcategory}</h3>
          <Link to={`/products/${category}/${subcategory}`} className="category-link">
                <span className='see-all'>See All</span> <i className="arrow-icon">&gt;</i>
                 </Link>
            </div>
          <div className="product-grid-c">
            {groupedProducts[subcategory].map((product) => (
              <div className="product-card-c" key={product._id}>
                {product.offeringDiscount > 0 && (
                            <div className="discount-badge-h">
                             -{Math.floor(product.discountPercentage)}%
                             </div>
                               )}
                <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
                  {product.images && product.images.length > 0 && (
                    <img
                      className="product-image-c"
                      src={`${Backend}/uploads/productImages/${product.images[0]}`}
                      alt={product.title}
                    />
                  )}
                  <h3 className="product-name-c">{product.title}</h3>
                  {product.offeringDiscount? (
                <>
                 <p className="product-discounted-price-h">
                GH₵ {product.discountAmount}
                <span className="product-original-price-h">GH₵ {product.price}</span>
                 </p>
                {/*<p className="product-discount-percentage-h">-{Math.floor(product.discountPercentage)}%</p>*/}
                </>
                 ) : (
               <p className="product-price-c">GH₵ {product.price}</p>
                  )}
                </Link>
                <button
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
};

export default ProductsCategoryPage;
