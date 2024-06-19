import { Router } from 'express';
import { logInAdmin } from '../models/admin.js';

const router = Router();

// POST log in admin user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token } = await logInAdmin(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
