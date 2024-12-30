import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    const isAuth = !!localStorage.getItem("authToken");
    return !isAuth ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
