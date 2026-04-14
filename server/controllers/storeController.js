import Store from '../models/Store.js';

// @desc    Create a store (seller only)
// @route   POST /api/stores
// @access  Private/Seller
export const createStore = async (req, res) => {
  try {
    // Check if seller already has a store
    const existingStore = await Store.findOne({ seller: req.user.id });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'You already have a store',
      });
    }

    const { shopName, bio, bannerImage } = req.body;

    const store = await Store.create({
      seller: req.user.id,
      shopName,
      bio,
      bannerImage,
    });

    res.status(201).json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
export const getStores = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stores = await Store.find({ isApproved: true })
      .populate('seller', 'name email')
      .skip(skip)
      .limit(limit);

    const total = await Store.countDocuments({ isApproved: true });

    res.json({
      success: true,
      count: stores.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
export const getStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('seller', 'name email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Update store (seller only, own store)
// @route   PUT /api/stores/:id
// @access  Private/Seller
export const updateStore = async (req, res) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Check if user owns the store
    if (store.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this store',
      });
    }

    const { shopName, bio, bannerImage } = req.body;

    store = await Store.findByIdAndUpdate(
      req.params.id,
      { shopName, bio, bannerImage },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Approve store (admin only)
// @route   PATCH /api/stores/:id/approve
// @access  Private/Admin
export const approveStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    store.isApproved = true;
    await store.save();

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

// @desc    Get seller's own store
// @route   GET /api/stores/my-store
// @access  Private/Seller
export const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ seller: req.user.id }).populate('seller', 'name email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'No store found for this seller',
      });
    }

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};
