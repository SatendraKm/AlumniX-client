import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");
  return token ? children || <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
