import express from 'express';
import requireLogin from '../middlewares/requireLogin.js';
import session from 'express-session'; // for handling user sessions - login status
import { validateUserCreation } from '../middlewares/validation.js';
import { createUser, getUserById, validateUser } from '../models/user.js';
import { orders } from './order.js';
import { cart } from './cart.js';

const router = express.Router();

// Orders - User can see order history if logged in
router.get('/orders', requireLogin, async (req, res) => {
  try {
    const currentUserOrders = await orders.find({ userId: req.session.currentUser });
    if (currentUserOrders.length === 0) {
      return res.status(404).send('No orders found');
    }

    const orderItems = currentUserOrders.flatMap(order =>
      order.items.map(item => ({
        date: item.date,
        title: item.title,
        price: item.price,
      }))
    );

    let orderHistory = 'Previous orders:\n<ul>';
    orderItems.forEach(order => {
      orderHistory += `<li>${order.date}: ${order.title} (${order.price} kr)</li>`;
    });
    orderHistory += '</ul>';

    const orderIds = currentUserOrders.map(order => order._id).join('<br>');
    res.send(`${orderHistory}<br>Order IDs:<br>${orderIds}`);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal server error');
  }
});

// Create user and return user ID
router.post('/register', validateUserCreation, (req, res) => {
  const { username, password } = req.body;
  createUser(username, password, (err, user) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({ userId: user.userId });
  });
});

// Get user by ID
router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  getUserById(userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  validateUser(username, password, (err, user) => {
    if (err || !user) {
      console.error('Login error:', err || 'Incorrect username or password');
      return res.status(401).send('Username or password was incorrect');
    }

    req.session.userId = user.userId; // Save user ID in session
    req.session.currentUser = user.userId; // Save current user ID for access in other functions
    req.session.isOnline = true; // Set login status to true

    res.send(`User successfully logged in. Login status: ${req.session.isOnline}`);
  });
});

// Check login status
router.get('/status', (req, res) => {
  res.send(`Login status: ${req.session.isOnline}`);
});

// Logout and clear user's cart
router.post('/logout', requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).send('User ID is missing from session');
    }

    const numRemoved = await cart.remove({ userId: userId }, { multi: true }); // Clear user's cart

    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send('Failed to log out and clear cart');
      }

      res.send(`User successfully logged out and cart cleared. Items removed from cart: ${numRemoved}`);
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Failed to log out and clear cart');
  }
});

export default router;
