import { useState,useEffect , createContext } from "react";

export const ProductContext = createContext()
export const ProductProvider = ({children})=>{
    const [products,setProducts] = useState([])
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   
  const fetchProducts = async (storeId) => {
   

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/marketplace/buyer/getstoreproducts/${storeId}`,{
        method:'GET',
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Cache products
      } else {
        setError('Failed to fetch products.');
      }
    } catch (error) {
      setError('An error occurred.');
    } finally {
      console.log(products)
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Automatically fetch when context is initialized
  },  []);

  return (
    <ProductContext.Provider value={{ products, fetchProducts, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}