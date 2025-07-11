import express from 'express';
import { initiatePayment, getPaymentStatus, getPaymentHistory, getPaymentById,
    deletePayment, updatePayment, getAllPayments
} from '../../controllers/Payments/Payments.js';
import { verifyToken } from '../../middlewares/protect.js';

const router = express.Router();

router.post('/initiate', verifyToken, initiatePayment);
router.get('/status/:id', verifyToken, getPaymentStatus);
router.get('/history', verifyToken, getPaymentHistory);
router.get('/get/:id', verifyToken, getPaymentById);
router.delete('/delete/:id', verifyToken, deletePayment);
router.patch('/updatepayment/:id/update', verifyToken, updatePayment);
router.get('/getpayment', getAllPayments);


export default router;
// Note: The `verifyToken` middleware checks if the user is authenticated.
// The `initiatePayment` controller is used to initiate a payment, and the `getPaymentStatus` controller retrieves the status of a payment.
// The routes are protected, meaning only authenticated users can access them.