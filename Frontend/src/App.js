import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import SellerRegistrationForm from './pages/sellerRegistrationForm.js';
import SellerLogin from './pages/SellerLogin.js';
import Store from './pages/singleStore';
import ProductDetails from './pages/productDetails';
import CreateStorePage from './pages/createStore';
import SellerStoreOverview from './pages/SellerStoreOverview.js';
import SellerDashboard from './pages/sellerDashboard.js';
import StoresPage from './pages/SellerStores.js';
import ManageProducts from './pages/ManageProdutcs';
import ProductsPage from './pages/ProductsPage.js';
import AddProducts from './pages/AddProducts.js';
import EditProduct from './pages/EditProduct.js';
import ProductsCategoryPage from './pages/ProductsCategoryPage.js';
import ProtectedRoutes from './components/ProtectedRoutes.js';
import CartPage from './pages/CartPage.js';
import Stores from './pages/Stores.js';
import CheckoutPage from './pages/CheckoutPage.js';
import ViewOrdersPage from './pages/ViewOrdersPage.js';
import SellerViewOrders from './pages/SellerViewOrders.js';
import SubCategoryPage from './pages/SubCategoriesPage.js';
import UpdateStorePage from './pages/UpdateStore.js';
import UserProfile from './pages/UserProfile.js';
import RunDiscount from './components/RunDiscount.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import './App.css';


function App() {
  return (
    <Router>
       <Routes>
         <Route path='/' element={<LandingPage/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/logout' element={<Login/>}/>
         <Route path='/signup' element={< SignUp/>}/>
         <Route path='/home' element={< Home/>}/>
         <Route path='/products' element={<ProductsPage/>}/>
         <Route path='/stores' element={< Stores/>}/>
         <Route path='/cart' element={<CartPage/>}/>
         <Route path='/orders' element={<ViewOrdersPage/>}/>
         <Route path='/checkout' element={<  CheckoutPage/>}/>
         <Route path='/products/:category' element={<ProductsCategoryPage/>}/>
         <Route path='/products/:category/:subcategory' element={<SubCategoryPage/>}/>
         <Route path='/productdetails/:productId' element={< ProductDetails/>}/>
         <Route path='/storedetails/:storeId' element={< Store/>}/>
         <Route path ='/user/profile' element={<UserProfile/>}/>
         
         


         {/*Seller Routes */}
         <Route path='/sell' element={< SellerRegistrationForm/>}/>
         <Route path='/seller/login' element={< SellerLogin/>}/>
         <Route path='/seller/createstore' element={<CreateStorePage/>}/>
         <Route path='/seller/stores' element={<ProtectedRoutes><StoresPage/></ProtectedRoutes>}/>
         <Route path='/seller/addproduct/:storeId' element={<ProtectedRoutes><AddProducts/></ProtectedRoutes>}/>
         <Route path='/seller/dashboard' 

         element={<ProtectedRoutes>< SellerDashboard /></ProtectedRoutes>}/>
         <Route  path='/seller/updatestore/:storeId' element={<UpdateStorePage/>}/>
          <Route path='/seller/vieworders/:storeId' element={< SellerViewOrders/>}/>
         <Route path='/seller/viewstore/:storeId' element={<ProtectedRoutes><SellerStoreOverview/></ProtectedRoutes>}/>
         <Route path='/seller/manageproducts/:storeId' element={<ProtectedRoutes><ManageProducts/></ProtectedRoutes>}/>
         <Route path='/seller/editproduct/:productId' element={<ProtectedRoutes><EditProduct /></ProtectedRoutes>}/>
         <Route path='/seller/rundiscount/:storeId/:productId' element={<RunDiscount/>}/>


       </Routes>
    </Router>
  );
}

export default App;
