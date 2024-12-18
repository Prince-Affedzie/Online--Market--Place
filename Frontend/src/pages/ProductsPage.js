import React, { useState,useEffect ,useContext } from 'react';
import { Link } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoriesSection from '../components/CategoriesSection';
import { ProductsContext } from '../Context/ProductsViewContext';
import TrendingProductsCarousel from '../components/TrendingProducts';
import './ProductsPage.css';
const Backend = 'http://localhost:3000';

const ProductsPage = () => {
  const {fetchProducts1,loading,products,error} = useContext(ProductsContext)
  
  //const [loading, setLoading] = useState(true);
 /* const [products, setProducts] = useState([
    
  ]); */

  useEffect(()=>{
   /* const fetchProducts = async () => {
        try {
          const response = await fetch(`${Backend}/api/marketplace/buyer/getallproducts`, {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
           
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }finally {
          setLoading(false);
        }
      };*/
      fetchProducts1()
  
  },[])

  const handleAddToCart = async(productId)=>{
    try{
      const response = await fetch(`${Backend}/api/marketplace/buyer/addtocart`,{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify({productId}),
        credentials:'include'
      })
      if(response.ok){
        alert('Product Added to Cart')
      }else {
        console.error('Failed to add product to cart:', response.statusText);
      }

    }catch(err){
      console.log(err)
    }
  }

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="products-page">
      <HomeNavBar />

      <section className="hero-section-1">
        <div className="hero-content-1">
        <h1 >Discover Amazing Products </h1>
          <button className="cta-button">Start Shopping</button>
        </div>
      </section>

      <div className="products-layout">
        <aside className="sidebar">
          <CategoriesSection />
        </aside>

        <div className="product-section">
         
          <TrendingProductsCarousel/>
          {/* Render products grouped by category */}
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="category-section">
              <div className="category-header">
                <h4 className="category-title">
                  {category}
                  <Link to={`/products/${category}`} className="category-link">
                    {'See All >'}
                  </Link>
                </h4>
              </div>
              <div className="product-grid">
                {groupedProducts[category].map((product) => (
                  <div className="product-card" key={product._id}>
                    <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
                      {product.images && product.images.length > 0 && (
                        <img
                          src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                          alt={product.title}
                          className="product-image"
                        />
                      )}
                      <h3 className="product-name">{product.title}</h3>
                      <p className="product-price">GH₵ {product.price}</p>
                    </Link>
                    <button className="add-to-cart" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
