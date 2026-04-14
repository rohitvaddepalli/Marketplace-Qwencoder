import Product from '../models/Product.js';
import Store from '../models/Store.js';

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by seller
    if (req.query.seller) {
      query.seller = req.query.seller;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',');
      sortBy.forEach((item) => {
        const [field, order] = item.split(':');
        sort[field] = order === 'desc' ? -1 : 1;
      });
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .populate('store', 'shopName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('store', 'shopName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Create product (seller only)
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res) => {
  try {
    // Check if seller has a store
    const store = await Store.findOne({ seller: req.user.id });
    if (!store) {
      return res.status(400).json({
        success: false,
        message: 'You must create a store before adding products',
      });
    }

    if (!store.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your store must be approved by admin before adding products',
      });
    }

    const { title, description, price, category, stock, images } = req.body;

    const product = await Product.create({
      seller: req.user.id,
      store: store._id,
      title,
      description,
      price,
      category,
      stock,
      images,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update product (seller only, own products)
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const { title, description, price, category, stock, images } = req.body;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, stock, images },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Delete product (seller or admin)
// @route   DELETE /api/products/:id
// @access  Private/Seller/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get seller's products
// @route   GET /api/products/seller/my-products
// @access  Private/Seller
export const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ seller: req.user.id });

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};
