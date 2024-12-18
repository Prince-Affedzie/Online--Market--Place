import { createContext,useState,useEffect } from "react";
const Backend = 'http://localhost:3000'

export const AuthContext = createContext()

export const AuthProvider =({children})=>{

    const [isAuthenticated,setIsAuthenticated] = useState(false)
    useEffect(() => {
        // Function to check if the user is authenticated (based on the cookie)
        const checkAuth = async () => {
          try {
            const response = await fetch(`${Backend}/api/marketplace/seller/auth`, {
              method: 'GET',
              credentials: 'include', // Important: send cookies with the request
            });
    
            if (response.ok) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
            }
          } catch (error) {
            setIsAuthenticated(false);
          }
        };
    
        checkAuth();
      }, []);

      return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          {children}
        </AuthContext.Provider>
      );
}
