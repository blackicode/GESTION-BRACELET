// services/paymentService.js

/**
 * Simule l'initiation d'un paiement mobile via Orange Money ou MTN MoMo.
 * @param {Object} options - Options de paiement
 * @param {string} options.provider - Le fournisseur : "OrangeMoney" ou "MoMo"
 * @param {number} options.amount - Montant à payer
 * @param {Object} options.user - Utilisateur (doit contenir un _id)
 * @returns {Object} Détail de la transaction simulée
 */
export const initiateMobilePayment = async ({ provider, amount, user }) => {
  if (!provider || !amount || !user) {
    throw new Error("Les paramètres provider, amount et user sont obligatoires.");
  }

  // Génération d'un ID de transaction fictif
  const fakeTransactionId = `${provider.toUpperCase()}-${Date.now()}-${user._id}`;

  // Simule l'appel vers l'API mobile money
  return {
    transactionId: fakeTransactionId,
    status: "pending",
  };
};

/**
 * Simule la récupération du statut d'une transaction.
 * @param {string} transactionId - L'identifiant de transaction à vérifier
 * @returns {Object} Statut actuel de la transaction
 */
export const getPaymentStatus = async (transactionId) => {
  if (!transactionId) {
    throw new Error("transactionId est requis");
  }

  // Statuts simulés pour l'exemple
  const statuses = ["pending", "paid", "failed"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    transactionId,
    status: randomStatus,
  };
};
