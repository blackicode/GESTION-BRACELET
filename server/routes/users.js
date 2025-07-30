// routes/users.js
import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middlewares/protect.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  console.log('Route /users atteinte');
  try {
    const users = await User.find(
      { userType: { $in: ['Patient', 'Medecin'] } },
      'firstName lastName photo userType _id'
    );
    console.log('Utilisateurs envoyés:', users);
    res.set('Cache-Control', 'no-store');
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur dans /users:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

export default router;