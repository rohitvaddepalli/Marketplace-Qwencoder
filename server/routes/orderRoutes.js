import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules for order creation
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
];

router.route('/')
  .post(protect, authorize('customer'), orderValidation, validate, createOrder)
  .get(protect, authorize('admin'), getAllOrders);

router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/seller-orders', protect, authorize('seller'), getSellerOrders);

router.route('/:id')
  .get(protect, getOrder);

router.patch('/:id/status', protect, authorize('seller', 'admin'), updateOrderStatus);

export default router;
