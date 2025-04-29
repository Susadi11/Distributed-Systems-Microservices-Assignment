import express from 'express';
import { 
  getAllDeliveries, 
  createDelivery, 
  updateDeliveryStatus, 
  deleteDelivery 
} from '../controllers/deliveryController.js';

const router = express.Router();

router.get(
    '/getall', 
    getAllDeliveries
);

router.post(
    '/create', 
    createDelivery
);

router.patch(
    '/:id', 
    updateDeliveryStatus
);

router.delete(
    '/:id', 
    deleteDelivery
);

export default router;
