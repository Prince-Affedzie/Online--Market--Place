import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './Home.css'; // Ensure the CSS is updated for responsiveness
import Footer from '../components/Footer';
import HomeNavBar from '../components/HomeNavBar';
import CategoriesSection from '../components/CategoriesSection';
import VendorSpotlight from '../components/VendorSpotlight';
import TrendingProductsCarousel from '../components/TrendingProducts';
import { ProductsContext } from '../Context/ProductsViewContext';

const Home = () => {
  const { products, fetchProducts1, loading, fetchElements, banners, logo, fetchStores, stores } = useContext(ProductsContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState(['Electronics', 'Home Appliances', 'Fashion', 'Mobile Phones', 'Beauty', 'Computing']);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    fetchProducts1();
    fetchStores();
    fetchElements();
  }, [fetchProducts1, fetchStores, fetchElements]);

  useEffect(() => {
    const groupedProducts = {};
    products.forEach((product) => {
      const category = product.category;
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      groupedProducts[category].push(product);
    });
    setProductsByCategory(groupedProducts);
  }, [products]);

  return (
    <div className="home-page">
       <HomeNavBar />
      
      <div className="container-h">
     
      
        <main className="main-content-h">
          <section className="hero-section">
         
            <div className="hero-content">
             {/* <h1>Discover Amazing Products & Stores</h1>
              <p>Your one-stop marketplace for the best products from trusted sellers.</p>
              <button onClick={() => navigate('/home')} className="cta-button">
                Start Shopping
              </button> */}
            </div>
          </section>
         
        <CategoriesSection/>
       
          

          <section className="trending-section">
            <TrendingProductsCarousel />
          </section>

          {categories.map((category) => (
            <section className="category-section-h" key={category}>
              <div className="category-header-h">
                <h5 className="category-title-h">{category}</h5>
                <Link to={`/products/${category}`} className="category-link">
                <span className='see-all'>See All</span> <i className="arrow-icon">&gt;</i>
                 </Link>

              </div>
              <div className="products-grid-h">
  {productsByCategory[category]?.slice(0, 5).map((product) => (
    <div key={product._id} className="product-card-h">
      {product.offeringDiscount > 0 && (
          <div className="discount-badge-h">
            -{Math.floor(product.discountPercentage)}%
          </div>
        )}
      <Link to={`/productdetails/${product._id}`} style={{textDecoration: 'none'}}>
        {product.images && product.images.length > 0 && (
          <img
            src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
            alt={product.title}
            className="product-image-h"
          />
        )}
        <p className="product-title-h">{product.title}</p>
        {product.offeringDiscount? (
            <>
              <p className="product-discounted-price-h">
                GH₵ {product.discountAmount}
                <span className="product-original-price-h">GH₵ {product.price}</span>
              </p>
              {/*<p className="product-discount-percentage-h">-{Math.floor(product.discountPercentage)}%</p>*/}
            </>
          ) : (
            <p className="product-price-h">GH₵ {product.price}</p>
          )}
      </Link>
    </div>
  ))}
</div>
              <VendorSpotlight
                 category={category}
                categoryStores={stores.filter(
                  (store) =>
                    store.store_category?.toLowerCase().includes(category.toLowerCase()) ||
                    store.store_name?.toLowerCase().includes(category.toLowerCase())
                )}
              />
            </section>
          ))}

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
