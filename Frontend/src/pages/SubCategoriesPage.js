import React, { useState, useEffect, useContext } from 'react';
import { ProductsContext } from '../Context/ProductsViewContext';
import { Link, useParams } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import Footer from '../components/Footer';
import './ProductsCategoryPage.css';
import './Subcategory.css'

const Backend = 'http://localhost:3000';

const SubCategoryPage = () => {
    const { products } = useContext(ProductsContext);
    const { subcategory } = useParams();
    const [subcategoryProducts, setSubCategoryProducts] = useState([]);

    useEffect(() => {
        // Filter products by subcategory
        const filteredProducts = products.filter(product => product.subcategory === subcategory);
        setSubCategoryProducts(filteredProducts);
    }, [products, subcategory]); // include `products` and `subcategory` as dependencies

    const handleAddToCart = async (productId) => {
        try {
            const response = await fetch(`${Backend}/api/marketplace/buyer/addtocart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId }),
                credentials: 'include'
            });
            if (response.ok) {
                alert('Product Added to Cart');
            } else {
                console.error('Failed to add product to cart:', response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="products-page">
            <HomeNavBar />
            <div className="filters">
                <input type="text" placeholder="Search Products..." className="search-bar" />
                <div className="filter-options">
                    <label>Sort by:</label>
                    <select>
                        <option value="price">Price</option>
                        <option value="popularity">Popularity</option>
                        <option value="rating">Rating</option>
                    </select>
                </div>
            </div>

            <div className="products-grid-s">
                {subcategoryProducts.length > 0 ? (
                    subcategoryProducts.map(product => (
                        <div className="product-card-s" key={product._id}>
                            {product.offeringDiscount > 0 && (
                            <div className="discount-badge-h">
                             -{Math.floor(product.discountPercentage)}%
                             </div>
                               )}
                            <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
                                {product.images && product.images.length > 0 && (
                                    <img
                                        className='product-image-s'
                                        src={`${Backend}/uploads/productImages/${product.images[0]}`}
                                        alt={product.title}
                                    />
                                )}
                                <h3 className="product-title-s">{product.title}</h3>
                                {product.offeringDiscount? (
                                 <>
                                   <p className="product-discounted-price-h">
                                    GH₵ {product.discountAmount}
                                      <span className="product-original-price-h">GH₵ {product.price}</span>
                                    </p>
                            {/*<p className="product-discount-percentage-h">-{Math.floor(product.discountPercentage)}%</p>*/}
                                    </>
                                       ) : (
                                      <p className="product-price-s">GH₵ {product.price}</p>
                                    )}                            </Link>
                            <button className="add-to-cart" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                        </div>
                    ))
                ) : (
                    <p>No products found in this subcategory.</p>
                )}
            </div>

            <div className="pagination">
                {/* Pagination buttons can go here */}
            </div>
            <Footer />
        </div>
    );
};

export default SubCategoryPage;
