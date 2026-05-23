import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../../src/utils/auth";


export  function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}