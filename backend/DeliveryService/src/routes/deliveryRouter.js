import express from 'express';
import { 
  getAllDeliveries, 
  createDelivery, 
  updateDeliveryStatus, 
  deleteDelivery 
} from '../controllers/deliveryController.js';

const router = express.Router();

router.get(
    '/', 
    getAllDeliveries
);

router.post(
    '/', 
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
