import { Routes, Route } from "react-router-dom";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/SignUp";

import ProtectedRoute from "./Routes/ProtectedRoute";
import UserRoute from "./Routes/UserRoute";
import OwnerRoute from "./Routes/OwnerRoute";
import AdminRoute from "./Routes/AdminRoute";

import UserDashboard from "./Pages/user/Dashboard";
import MyRequests from "./Pages/user/MyRequests";
import Properties from "./Pages/user/Properties";
import PropertyDetails from "./Pages/user/PropertyDetails";
import Recommended from "./Pages/user/Recommended";

import OwnerDashboard from "./Pages/owner/OwnerDashboard";
import MyProperties from "./Pages/owner/MyProperties";
import PropertyForm from "./Pages/owner/PropertyForm";
import Requests from "./Pages/owner/Requests";

import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminUsers from "./Pages/admin/Users";
import AdminProperties from "./Pages/admin/Properties";
import Analytics from "./Pages/admin/Analytics";
import AdminCategories from "./Pages/admin/Categories";

import Profile from "./Pages/shared/Profile";

const App = () => {
 return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          {/* User Routes */}
          <Route element={<UserRoute />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/requests" element={<MyRequests />} />
            <Route path="/user/properties" element={<Properties />} />
            <Route path="/user/properties/:id" element={<PropertyDetails />} />
            <Route path="/user/recommended" element={<Recommended />} />

            <Route path="/user/profile" element={<Profile />} />
          </Route>

          {/* Owner Routes */}
          <Route element={<OwnerRoute />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/properties" element={<MyProperties />} />
            <Route path="/owner/properties/add" element={<PropertyForm />} />
            <Route
              path="/owner/properties/edit/:id"
              element={<PropertyForm />}
            />
            <Route path="/owner/requests" element={<Requests />} />

            <Route path="/owner/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/categories" element={<AdminCategories />} />

            <Route path="/admin/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;