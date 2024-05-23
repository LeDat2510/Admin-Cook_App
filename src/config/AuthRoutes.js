import React from 'react'
import { getUserDataFromLocalStorage } from './localstorage'
import { Navigate} from 'react-router-dom';

export const AuthRoutes = ({children}) => {
    const userData = getUserDataFromLocalStorage();
   if(userData)
   {
     return children
   }
   return <Navigate to='/login'></Navigate>
}

export const AuthWrapperLogin = ({ children }) => {
    const userData = getUserDataFromLocalStorage();
  
    if (userData) {
        return <Navigate to='/manageuser'></Navigate>
    }
    return children;
  };