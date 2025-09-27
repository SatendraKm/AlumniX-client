import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Login,
  Signup,
  HomePage,
  VerifyOTP,
  UserDetail,
  ForgotPassword,
  RegisterOrganization,
  Dashboard,
  ResetPassword,
  OrganizationLogin,
  Error404,
} from "./pages/index";
import { Navigate } from "react-router-dom";

import PrivateRoute from "./utils/PrivateRoute";
import Cookies from "js-cookie";
import Admin from "./pages/Admin/Admin";

function App() {
  const token = Cookies.get("token");
  const role = Cookies.get("role"); // Retrieve the role from cookies

  return (
    <div className="font-sans max-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/organization-login" element={<OrganizationLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/register-organization"
          element={<RegisterOrganization />}
        />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/user-detail" element={<UserDetail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private Routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </div>
  );
}

export default App;
