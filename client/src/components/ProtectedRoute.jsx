import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const canAccessOtp = sessionStorage.getItem("canAccessOtp");

  if (!canAccessOtp) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
