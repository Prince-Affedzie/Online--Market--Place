import React, { useEffect, useState,useContext
 } from 'react';
import { useParams,Link,useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HomeNavBar from '../components/HomeNavBar';
import Header from '../components/Header';
import ProductReview from '../components/ProductReview';
import StarRating from '../components/StarRating';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { ProductContext } from '../Context/ProductContext';
import './productDetails.css';

const Backend = 'http://localhost:3000';

const ProductDetails = () => {
    const {fetchProducts} = useContext(ProductContext)
    const navigate = useNavigate()
    
  const {products,setProducts} =  useContext(ProductContext)
  const { productId } = useParams();
  const [storeId,setStoreId] = useState()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0); // Handle image gallery
  const [error, setError] = useState(null); // For handling errors

  const shuffleArray = (array) => {
    // Create a copy of the array to avoid mutating the original one
    let shuffledArray = [...array];
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    
    return shuffledArray;
  };
  
  
  const shuffledProducts = shuffleArray(products);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/buyer/getproductdetails/${productId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data.store_id._id)
          setStoreId(data.store_id._id)
          setProduct(data);
         
        } else {
          setError('Failed to fetch product details.');
        }
      } catch (error) {
        setError('Error fetching the product.');
        console.error('Error fetching the product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    
  }, [productId]);
 
  useEffect(() => {
    if (storeId) { 
        fetchProducts(storeId);
    }
}, [storeId]);


  const submitReview = async ({ productId, rating, comments }) => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/buyer/review/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comments,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit the review');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        toast.success('Product Added to Cart!')
      } else {
        console.error('Failed to add product to cart:', response.statusText);
        toast.error('Failed to add product to cart.');
      }
    } catch (err) {
      console.log(err);
      toast.error('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="product-details-page">
   <HomeNavBar />
   <ToastContainer /> 

  <div className="product-details-container">
    {/* Image Gallery Section */}
    <div className="product-images">
      <div className="main-image">
        <img
          src={`http://localhost:3000/uploads/productImages/${product.images[selectedImage]}`}
          alt={product.title}
        />
      </div>
      <div className="thumbnail-gallery">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={`http://localhost:3000/uploads/productImages/${image}`}
            alt={product.title}
            onClick={() => setSelectedImage(index)}
            className={selectedImage === index ? 'active' : ''}
          />
        ))}
      </div>
    </div>

    {/* Product Info Section */}
    <div className="product-info">
      <h1>{product.title}</h1>
      <div className="pricing-section">
        {/*<span className="original-price">GH₵{product.price}</span>*/}
        {product.offeringDiscount? (
            <>
              <p className="price">
                GH₵ {product.discountAmount}
                <span className="product-original-price-h">GH₵ {product.price}</span>
              </p>
              {/*<p className="product-discount-percentage-h">-{Math.floor(product.discountPercentage)}%</p>*/}
            </>
          ) : (

            <p className="product-price-d">GH₵ {product.price}</p>
          )}
      </div>
      <p className="description">{product.description}</p>
      <h3 className="description">{product.store_id.store_name}</h3>


      {/* Size Options */}
     

      {/* Buttons */}
      <button className="add-to-cart-btn" onClick={() => handleAddToCart(product._id)}>
        Add to Cart
      </button>
      <button onClick={()=>navigate('/home')} className="checkout-btn">Continue Shopping</button>
    </div>
  </div>

  {/* Related Items */}
  <div className="related-items">
    <h2>Similar Products By Store:</h2>
    <div className="related-items-container">
      {/* Example Related Item */}
     {shuffledProducts?.slice(0,4).map((product, index) => (
       <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
        <div key={product._id} className="related-item-card">
         {product.images && product.images.length > 0 && (
                            <img
                              src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                              alt={product.title}
                            />
                          )}
          <p>{product.title}</p>
          <p className="price">GH₵{product.price}</p>
        </div>
        </Link>
      ))} 
    </div>
  </div>

  <Footer />
</div>

  );
};

export default ProductDetails;
