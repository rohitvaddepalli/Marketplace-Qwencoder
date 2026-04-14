import { useCart } from '../hooks/useCart';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, total, updateItemQuantity, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <Link
          to="/products"
          className="text-indigo-600 hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
              <img
                src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-indigo-600 font-bold">${item.price?.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateItemQuantity(item.product, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.product, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.product)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">$0.00</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={emptyCart}
            className="w-full mt-2 text-red-600 py-2 hover:underline"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
