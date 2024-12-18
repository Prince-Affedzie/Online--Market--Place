import React, {useContext} from "react";
import {Navigate} from 'react-router-dom'
import  {AuthContext}  from '../Context/AuthContext'


const ProtectedRoutes = ({children})=>{
 const {isAuthenticated} = useContext(AuthContext)

 if(!isAuthenticated){
    return <Navigate to="/seller/login" replace/>
 }
 return children
}

export default ProtectedRoutes