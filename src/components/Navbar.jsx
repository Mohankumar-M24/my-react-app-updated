import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const { isLoggedIn, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🛍️ E-Commerce
      </Link>

      <div className="space-x-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            {role === 'buyer' && (
              <Link to="/dashboard/buyer" className="hover:underline">
                Buyer Dashboard
              </Link>
            )}
            {role === 'seller' && (
              <Link to="/dashboard" className="hover:underline">
                Seller Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-white">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
