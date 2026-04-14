import Cart from '../models/Cart.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id }).populate(
      'items.product',
      'title price images'
    );

    if (!cart) {
      cart = await Cart.create({ customer: req.user.id, items: [] });
    }

    // Calculate total
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    }

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      cart = await Cart.create({ customer: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images'
    );

    // Calculate total
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    }

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images'
    );

    // Calculate total
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    }

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    cart = await Cart.findById(cart._id).populate(
      'items.product',
      'title price images'
    );

    // Calculate total
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    }

    res.json({
      success: true,
      data: {
        ...cart.toObject(),
        totalItems,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};
