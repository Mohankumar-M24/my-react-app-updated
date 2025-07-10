import { NavLink, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const SidebarLayout = () => {
  const { role } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 shadow-md">
        <nav className="flex flex-col gap-4 text-lg">
          {role === 'buyer' && (
            <>
              <NavLink to="/dashboard/buyer" className="hover:underline">🏠 Dashboard</NavLink>
              <NavLink to="/dashboard/buyer/orders" className="hover:underline">📦 My Orders</NavLink>
              <NavLink to="/dashboard/buyer/cart" className="hover:underline">🛒 My Cart</NavLink>
              <NavLink to="/dashboard/buyer/wishlist" className="hover:underline">❤️ Wishlist</NavLink>
              <NavLink to="/dashboard/buyer/profile" className="hover:underline">⚙️ Profile Settings</NavLink>
            </>
          )}

          {role === 'seller' && (
            <>
              <NavLink to="/dashboard" className="hover:underline">📊 Seller Dashboard</NavLink>
              <NavLink to="/dashboard/add-product" className="hover:underline">➕ Add Product</NavLink>
              <NavLink to="/dashboard/my-products" className="hover:underline">📦 My Products</NavLink>
              <NavLink to="/dashboard/orders" className="hover:underline">🧾 Seller Orders</NavLink>
              {/*<NavLink to="/dashboard/edit-product" className="hover:underline">✏️ Edit Product</NavLink>*/}
              <NavLink to="/dashboard/store" className="hover:underline">🏬 Manage Store</NavLink> {/*  Added */}
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet /> {/*  Renders nested dashboard routes */}
      </main>
    </div>
  );
};

export default SidebarLayout;
