import express from 'express';
import { body } from 'express-validator';
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  approveStore,
  getMyStore,
} from '../controllers/storeController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const storeValidation = [
  body('shopName').trim().notEmpty().withMessage('Shop name is required'),
];

router.route('/')
  .get(getStores)
  .post(protect, authorize('seller'), storeValidation, validate, createStore);

router.get('/my-store', protect, authorize('seller'), getMyStore);

router.route('/:id')
  .get(getStore)
  .put(protect, authorize('seller'), storeValidation, validate, updateStore);

router.patch('/:id/approve', protect, authorize('admin'), approveStore);

export default router;
