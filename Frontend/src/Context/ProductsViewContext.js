import { createContext,useState,useEffect } from "react";

const Backend = 'http://localhost:3000'

export const ProductsContext = createContext()

export const ProductsProvider=({children})=>{

    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(false)
    const [stores,setStores] = useState([])
    const [banners,setBanners] = useState([])
    const [logo,setLogo] = useState()
    const [error,setError] = useState(null)
    
   
        const fetchProducts1 = async ()=>{
            if (products.length > 0) {
                return products; // If products already exist, skip fetching
            }
            
        try{
        
         const response = await fetch(`${Backend}/api/marketplace/buyer/getallproducts`,{
            method:'GET',
            credentials:'include'
         })
         if(response.ok){
            const data = await response.json()
            setProducts(data)
         }else{
            setError('Failed to fetch Products')
            setProducts([])
         }

        }catch(err){
           console.log(err) 
           setError('Failed to fetch Products')
        }
        }

      const fetchStores = async() =>{
        if (stores.length > 0) {
            return stores; // If products already exist, skip fetching
        }
        
    try{
    
     const response = await fetch(`${Backend}/api/marketplace/getallstores`,{
        method:'GET',
        credentials:'include'
     })
     if(response.ok){
        const data = await response.json()
        setStores(data)
     }else{
        setError('Failed to fetch Stores')
        setStores([])
     }

    }catch(err){
       console.log(err) 
       setError('Failed to fetch Stores')
    }

      }

   const fetchElements = async()=>{
      try{
         const response = await fetch(`${Backend}/api/marketplace/admin/getelements`,{
            method: 'GET',
            credentials:'include'
         })
         if(response.ok){
            const data = response.json()
            setBanners(data.homePageBanners)
            setLogo(data.homePageLogo)
         }else{
            setBanners([])
            setLogo('')
         }

      }catch(err){
         console.log(err)
      }
   }
        

      useEffect(() => {
        setLoading(true); // Start loading when the effect runs
        Promise.all([fetchProducts1(), fetchStores(), fetchElements()])
          .finally(() => {
            setLoading(false); // Set loading to false after all promises resolve or reject
          });
      }, []);
      
    

    return(
       < ProductsContext.Provider value={{products,stores,fetchStores,fetchProducts1, fetchElements, banners,logo,error,loading}}>
        {children}
       </ProductsContext.Provider>
    )


}
