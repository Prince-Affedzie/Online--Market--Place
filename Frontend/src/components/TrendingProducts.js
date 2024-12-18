import React, { useContext } from 'react';
import './TrendingProducts.css';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { ProductsContext } from '../Context/ProductsViewContext';

const TrendingProductsCarousel = () => {
  const { products } = useContext(ProductsContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="trending-products-carousel">
      <h2>🔥 Trending Products</h2>
      <Slider {...settings}>
        {products.slice(0, 4).map((product) => (
          <div key={product._id} className="carousel-item">
            <Link to={`/productdetails/${product._id}`} className="carousel-link" style={{textDecoration:'none'}}>
              <img
                className="carousel-product-image"
                src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                alt={product.title}
              />
              <h3 className="carousel-product-title">{product.title}</h3>
              <p className="carousel-product-price">GH₵ {product.price}</p>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrendingProductsCarousel;
