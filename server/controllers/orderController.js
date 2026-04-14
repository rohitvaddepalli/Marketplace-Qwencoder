import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order (customer only)
// @route   POST /api/orders
// @access  Private/Customer
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Calculate total and verify stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`,
        });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ customer: req.user.id });

    res.json({
      success: true,
      count: orders.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get seller's orders (orders containing their products)
// @route   GET /api/orders/seller-orders
// @access  Private/Seller
export const getSellerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
    const productIds = sellerProducts.map((p) => p._id);

    // Find orders containing these products
    const orders = await Order.find({
      'items.product': { $in: productIds },
    })
      .populate('customer', 'name email')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({
      'items.product': { $in: productIds },
    });

    res.json({
      success: true,
      count: orders.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      success: true,
      count: orders.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'title description images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (
      order.customer._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      // Check if user is the seller of any product in the order
      const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
      const productIds = sellerProducts.map((p) => p._id.toString());
      const orderProductIds = order.items.map((i) => i.product._id.toString());
      
      const isSeller = orderProductIds.some(id => productIds.includes(id));
      if (!isSeller) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this order',
        });
      }
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update order status (seller or admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Seller/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is authorized (seller of products in order or admin)
    if (req.user.role !== 'admin') {
      const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
      const productIds = sellerProducts.map((p) => p._id.toString());
      const orderProductIds = order.items.map((i) => i.product._id.toString());
      
      const isSeller = orderProductIds.some(id => productIds.includes(id));
      if (!isSeller) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order',
        });
      }
    }

    // If cancelling, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};
