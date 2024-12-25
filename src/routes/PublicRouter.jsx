import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    const isLogin = useSelector((state) => state.isAuth);

    return !isLogin ? children : <Navigate to="/" replace />;
};

export default PublicRoute;
