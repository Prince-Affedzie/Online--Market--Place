import React from 'react';
import './CategoriesSection.css'; // Import the CSS for styling
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
  // Updated category data structure with subcategories
  const categories = [
    { 
      id: 1, 
      name: 'Computing', 
      subcategories: ['Laptops', 'Desktops', 'Printers', 'Networking Devices','Laptop Accessories','Tablets','Scanners','Computer Accessories']
    },
    { 
      id: 2, 
      name: 'Mobile Phones', 
      subcategories: ['Smartphones','Tablets','Phone Accessories']
    },
    { 
      id: 3, 
      name: 'Electronics', 
      subcategories: ['TV', 'Cameras And Photos', 'Audio Equipment','Home Audio','Office Electronics','Headphones']
    },
    { 
      id: 4, 
      name: 'Fashion', 
      subcategories: ["Men's Fashion", "Women's Fashion", 'Accessories','Kids Fashion','Baby Fashion']
    },
    { 
      id: 5, 
      name: 'Home Appliances', 
      subcategories: ['Refrigerator', 'Microwaves', 'Washers', 'Vacuum Cleaners','Kitchen']
    },
    { 
      id: 6, 
      name: 'Beauty', 
      subcategories: ['Make Up', 'Skin Care', 'Hair Care', 'Fragrance','Tools &  Accessories','Foot,Hand & Nail care']
    },
    { 
      id: 7, 
      name: 'Sports & Outdoors', 
      subcategories: ['Fitness', 'Outdoor Gear', 'Sports Equipment']
    }
  ];

  return (
    <section className="categories-section">
     
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <Link to={`/products/${category.name}`} className="category-link-c">
              <p>
                {category.name}  
              </p>
            </Link>
            {/* Subcategory hover menu */}
            <div className ='subcategory-wrapper'>
              <ul className="subcategory-list">
              {category.subcategories.map((subcategory, index) => (
                <li key={index}>
                  <Link to={`/products/${category.name}/${subcategory}`} className="subcategory-link">
                    {subcategory}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
