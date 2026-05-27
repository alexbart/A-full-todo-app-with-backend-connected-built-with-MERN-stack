import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
    const { loading, user } = useAuth();

    // Prevent redirect loops while auth is still booting.
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    // If refresh failed, user will be null.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
