import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules for product creation/update
const productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
];

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller'), productValidation, validate, createProduct);

router.get('/seller/my-products', protect, authorize('seller'), getMyProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller'), productValidation, validate, updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

export default router;
