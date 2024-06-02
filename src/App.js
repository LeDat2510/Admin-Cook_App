import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ManageUser from './Pages/ManageUser';
import ApproveFood from './Pages/ApproveFood';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import { UserProvider } from './context/UserContext';
import MainLayout from './layout/MainLayout';
import FoodDetail from './Pages/FoodDetail';
import ManageFood from './Pages/ManageFood';
import ApproveBlog from './Pages/ApproveBlog';
import BlogDetail from './Pages/BlogDetail';
import ManageBlog from './Pages/ManageBlog';
import ManageTypeOfFood from './Pages/ManageTypeOfFood';
import { AuthRoutes, AuthWrapperLogin } from './config/AuthRoutes';
import Statistics from './Pages/Statistics';
import { getUserDataFromLocalStorage } from './config/localstorage';

function App() {

  return (
    <Router>
      <UserProvider>
        <div className="wrapper">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/statistics" />} />
              <Route path="/statistics" element={<AuthRoutes><Statistics /></AuthRoutes>} />
              <Route path="/manageuser" element={<AuthRoutes><ManageUser /></AuthRoutes>} />
              <Route path="/managefood" element={<AuthRoutes><ManageFood /></AuthRoutes>} />
              <Route path="/manageblog" element={<AuthRoutes><ManageBlog /></AuthRoutes>} />
              <Route path='/managetypeoffood' element={<AuthRoutes><ManageTypeOfFood /></AuthRoutes>}></Route>
              <Route path="/approvefood" element={<AuthRoutes><ApproveFood /></AuthRoutes>} />
              <Route path="/approveblog" element={<AuthRoutes><ApproveBlog /></AuthRoutes>} />
              <Route path="/fooddetail/:id" element={<AuthRoutes><FoodDetail /></AuthRoutes>} />
              <Route path="/blogdetail/:id" element={<AuthRoutes><BlogDetail /></AuthRoutes>} />
            </Route>
            <Route path="/login" element={<AuthWrapperLogin><Login /></AuthWrapperLogin>} />
            <Route path="/signup" element={<AuthWrapperLogin><SignUp /></AuthWrapperLogin>} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}

//<Route index element={<Login />} />

export default App;
