import React from 'react';
import {motion} from 'framer-motion'

const FeaturedSection = ({ products, stores }) => {
  return (
    <section className="featured">
      <h2>Featured Products</h2>
      <motion.div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
             {product.images && product.images.length > 0 && (
                      <img
                        src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                        alt={product.title}
                      />
                    )}
            <h3>{product.title}</h3>
            <p>Gh$ {product.price}</p>
          </div>
        ))}
      </motion.div>

      <h2>Featured Stores</h2>
      <div className="stores-grid">
        {stores.map(store => (
          <div key={store._id} className="store-card">
            <h3>{store.store_name}</h3>
            {store.store_logo && store.store_logo.length > 0 && (
                    <img
                      style={{ width: '50px', height: '50px' }}
                      src={`http://localhost:3000/uploads/stores/${store.store_logo}`}
                      alt={store.store_name}
                    />
                  )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
