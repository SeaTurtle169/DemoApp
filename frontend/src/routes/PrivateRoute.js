import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  if (!token) {
    // chưa login thì quay về trang login
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    // login rồi nhưng role không đúng
    return <Navigate to="/login" replace />;
  }

  // Cho phép vào
  return children;
};

export default PrivateRoute;