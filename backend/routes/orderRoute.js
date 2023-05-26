import express from 'express';
import { createOrder, wakeUp } from '../controllers/orderController.js';

const router = express.Router();

// /api/order/create-order
router.post('/create-order', createOrder);

// /api/order/wakeup
router.get('/wakeup', wakeUp);

export default router;
