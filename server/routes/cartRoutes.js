import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be at least 0'),
];

router.route('/')
  .get(protect, getCart);

router.post('/add', protect, addToCartValidation, validate, addToCart);

router.put('/update', protect, updateCartValidation, validate, updateCartItem);

router.delete('/remove/:productId', protect, removeFromCart);

router.delete('/clear', protect, clearCart);

export default router;
