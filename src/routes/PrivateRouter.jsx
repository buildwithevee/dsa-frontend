import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.isAuth);

  return isLogin ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
