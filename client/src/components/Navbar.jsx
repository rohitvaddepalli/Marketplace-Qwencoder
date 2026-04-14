import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, userInfo, isAdmin, isSeller } = useAuth();
  const { itemCount } = useCart();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              🛍️ Marketplace
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/products" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                Browse Products
              </Link>
              <Link to="/stores" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                Stores
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                    Admin Dashboard
                  </Link>
                )}
                {isSeller && (
                  <Link to="/seller/dashboard" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                    Seller Dashboard
                  </Link>
                )}
                <Link to="/cart" className="relative hover:bg-indigo-500 px-3 py-2 rounded-md">
                  🛒 Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                  My Orders
                </Link>
                <span className="text-sm">Hi, {userInfo?.name}</span>
                <button
                  onClick={handleLogout}
                  className="hover:bg-indigo-500 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="hover:bg-indigo-500 px-3 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
