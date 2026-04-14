import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const addItem = (product, quantity = 1) => {
    dispatch(addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || '',
      quantity,
    }));
  };

  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const updateItemQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  return {
    cart,
    items: cart.items,
    total: cart.total,
    itemCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
  };
};
