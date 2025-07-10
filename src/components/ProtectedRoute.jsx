import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, role } = useContext(AuthContext);

  console.log(" ProtectedRoute check:", {
    isLoggedIn,
    role,
    allowedRoles,
  });

  if (!isLoggedIn) {
    console.warn(" Not logged in — redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(` Role "${role}" not allowed for this route`);
    return <Navigate to="/" replace />;
  }

  return children;
}
