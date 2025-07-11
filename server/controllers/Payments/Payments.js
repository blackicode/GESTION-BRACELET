// controllers/payments.js
import Payment from '../../models/Payments/Payments.js';
import {
  initiateMobilePayment,
  getPaymentStatus as simulateStatus
} from '../../Services/paymentService.js';

// 🔸 POST /api/payments/initiate
export const initiatePayment = async (req, res) => {
  try {
    const { provider, amount } = req.body;
    const user = req.user;

    if (!provider || !amount) {
      return res.status(400).json({ message: "Provider et montant sont requis." });
    }

    const result = await initiateMobilePayment({ provider, amount, user });

    const newPayment = new Payment({
      patientId: user.id,
      provider,
      amount,
      status: result.status,
      transactionId: result.transactionId,
      timestamp: new Date(),
    });

    await newPayment.save();

    res.status(200).json(newPayment);
  } catch (err) {
    console.error("Erreur paiement:", err);
    res.status(500).json({ message: "Erreur serveur lors du paiement." });
  }
};

// 🔸 GET /api/payments/status/:id
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement introuvable." });

    // Simule l'évolution du statut de paiement
    const updatedStatus = await simulateStatus(payment.transactionId);
    payment.status = updatedStatus.status;
    await payment.save();

    res.status(200).json({
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      provider: payment.provider,
    });
  } catch (err) {
    console.error("Erreur récupération paiement:", err);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du statut." });
  }
};
// 🔸 GET /api/payments/histor 
 export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.user.id }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération historique paiements:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération de l'historique des paiements." });
  }
}
// 🔸 DELETE /api/payments/:id
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement introuvable." });
    res.status(200).json({ message: "Paiement supprimé avec succès." });
  } catch (err) {
    console.error("Erreur suppression paiement:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du paiement." });
  }
};
// 🔸 PATCH /api/payments/:id/update
export const updatePayment = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Statut requis." });

    const payment = await Payment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!payment) return res.status(404).json({ message: "Paiement introuvable." });

    res.status(200).json(payment);
  } catch (err) {
    console.error("Erreur mise à jour paiement:", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du paiement." });
  }
};
// 🔸 GET /api/payments/:id
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Paiement introuvable." });
    res.status(200).json(payment);
  } catch (err) {
    console.error("Erreur récupération paiement:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du paiement." });
  }
};
// 🔸 GET /api/payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements." });
  }
};
// 🔸 GET /api/payments/patient/:patientId
export const getPaymentsByPatient = async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.params.patientId }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements du patient." });
  }
};
// 🔸 GET /api/payments/provider/:provider  
export const getPaymentsByProvider = async (req, res) => {
  try {
    const payments = await Payment.find({ provider: req.params.provider }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements fournisseur:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements du fournisseur." });
  }
};
// 🔸 GET /api/payments/amount/:amount
export const getPaymentsByAmount = async (req, res) => {
  try {
    const payments = await Payment.find({ amount: req.params.amount }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements montant:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par montant." });
  }
};
// 🔸 GET /api/payments/status/:status
export const getPaymentsByStatus = async (req, res) => {
  try {
    const payments = await Payment.find({ status: req.params.status }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements statut:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par statut." });
  }
};
// 🔸 GET /api/payments/timestamp/:timestamp  
export const getPaymentsByTimestamp = async (req, res) => {
  try {
    const payments = await Payment.find({ timestamp: { $gte: new Date(req.params.timestamp) } }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements timestamp:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par timestamp." });
  }
};
// 🔸 GET /api/payments/transaction/:transactionId
export const getPaymentsByTransactionId = async (req, res) => {
  try {
    const payments = await Payment.find({ transactionId: req.params.transactionId }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements transactionId:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par ID de transaction." });
  }
};
// 🔸 GET /api/payments/patient/:patientId/provider/:provider
export const getPaymentsByPatientAndProvider = async (req, res) => {
  try {
    const payments = await Payment.find({
      patientId: req.params.patientId,
      provider: req.params.provider
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient et fournisseur:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par patient et fournisseur." });
  }
};
// 🔸 GET /api/payments/patient/:patientId/status/:status
export const getPaymentsByPatientAndStatus = async (req, res) => {
  try {
    const payments = await Payment.find({
      patientId: req.params.patientId,
      status: req.params.status
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient et statut:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par patient et statut." });
  }
};
// 🔸 GET /api/payments/patient/:patientId/amount/:amount
export const getPaymentsByPatientAndAmount = async (req, res) => {
  try {
    const payments = await Payment.find({
      patientId: req.params.patientId,
      amount: req.params.amount
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient et montant:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par patient et montant." });
  }
};
// 🔸 GET /api/payments/patient/:patientId/timestamp/:timestamp 
export const getPaymentsByPatientAndTimestamp = async (req, res) => {
  try {
    const payments = await Payment.find({
      patientId: req.params.patientId,
      timestamp: { $gte: new Date(req.params.timestamp) }
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient et timestamp:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par patient et timestamp." });
  }
};
// 🔸 GET /api/payments/patient/:patientId/transaction/:transactionId
export const getPaymentsByPatientAndTransactionId = async (req, res) => {
  try {
    const payments = await Payment.find({
      patientId: req.params.patientId,
      transactionId: req.params.transactionId
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements patient et transactionId:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par patient et ID de transaction." });
  }
};
// 🔸 GET /api/payments/provider/:provider/status/:status
export const getPaymentsByProviderAndStatus = async (req, res) => {
  try {
    const payments = await Payment.find({
      provider: req.params.provider,
      status: req.params.status
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements fournisseur et statut:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par fournisseur et statut." });
  }
};  
// 🔸 GET /api/payments/provider/:provider/amount/:amount
export const getPaymentsByProviderAndAmount = async (req, res) => {
  try {
    const payments = await Payment.find({
      provider: req.params.provider,
      amount: req.params.amount
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements fournisseur et montant:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par fournisseur et montant." });
  }
};
// 🔸 GET /api/payments/provider/:provider/timestamp/:timestamp
export const getPaymentsByProviderAndTimestamp = async (req, res) => {
  try {
    const payments = await Payment.find({
      provider: req.params.provider,
      timestamp: { $gte: new Date(req.params.timestamp) }
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements fournisseur et timestamp:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par fournisseur et timestamp." });
  }
};
// 🔸 GET /api/payments/provider/:provider/transaction/:transactionId
export const getPaymentsByProviderAndTransactionId = async (req, res) => {
  try {
    const payments = await Payment.find({
      provider: req.params.provider,
      transactionId: req.params.transactionId
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements fournisseur et transactionId:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par fournisseur et ID de transaction." });
  }
};  
// 🔸 GET /api/payments/status/:status/amount/:amount
export const getPaymentsByStatusAndAmount = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: req.params.status,
      amount: req.params.amount
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements statut et montant:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par statut et montant." });
  }
};
// 🔸 GET /api/payments/status/:status/timestamp/:timestamp
export const getPaymentsByStatusAndTimestamp = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: req.params.status,
      timestamp: { $gte: new Date(req.params.timestamp) }
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements statut et timestamp:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par statut et timestamp." });
  }
};
// 🔸 GET /api/payments/status/:status/transaction/:transactionId
export const getPaymentsByStatusAndTransactionId = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: req.params.status,
      transactionId: req.params.transactionId
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements statut et transactionId:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par statut et ID de transaction." });
  }
};
// 🔸 GET /api/payments/amount/:amount/timestamp/:timestamp
export const getPaymentsByAmountAndTimestamp = async (req, res) => {
  try {
    const payments = await Payment.find({
      amount: req.params.amount,
      timestamp: { $gte: new Date(req.params.timestamp) }
    }).sort({ timestamp: -1 });
    res.status(200).json(payments);
  } catch (err) {
    console.error("Erreur récupération paiements montant et timestamp:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des paiements par montant et timestamp." });
  }
};