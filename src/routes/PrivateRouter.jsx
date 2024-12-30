import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuth = !!localStorage.getItem("authToken"); // Check token presence in localStorage

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
