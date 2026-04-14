import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getStats,
  getAllSellers,
  suspendSeller,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.get('/sellers', getAllSellers);

router.patch('/sellers/:id/suspend', suspendSeller);

export default router;
