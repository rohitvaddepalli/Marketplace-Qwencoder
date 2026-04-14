import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  } catch (error) {
    return { items: [], total: 0 };
  }
};

const initialState = {
  cart: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.items.find(
        (i) => i.product === item.product
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.items.push(item);
      }

      state.cart.total = state.cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart.items = state.cart.items.filter(
        (i) => i.product !== action.payload
      );
      state.cart.total = state.cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.items.find((i) => i.product === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.cart.items = state.cart.items.filter(
            (i) => i.product !== productId
          );
        }
      }
      state.cart.total = state.cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = { items: [], total: 0 };
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
