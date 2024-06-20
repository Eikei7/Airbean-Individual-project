import express from 'express';
import nedb from 'nedb-promise';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { cart } from './cart.js';
import db from '../database/db.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const orders = new nedb({ filename: path.join(__dirname, '../database/orders.db'), autoload: true });

router.use(
  session({
    secret: 'this is the key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to make session variables accessible
router.use((req, res, next) => {
  if (typeof req.session.isOnline === 'undefined') {
    req.session.isOnline = false;
  }
  next();
});

// GET menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await db.menu.find({}); // Fetch all items from the menu database

    // Map and format the menu items for display
    const coffeeMenu = menuItems.map((item) => ({
      id: item.id,
      title: item.title,
      desc: item.desc,
      price: item.price,
      createdAt: item.createdAt,
      modifiedAt: item.modifiedAt,
    }));

    res.status(200).json(coffeeMenu); // Send the menu items as a JSON response
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

// Place an order and store in order history
router.post('/', async (req, res) => {
  try {
    const currentUserCart = await cart.find({
      userId: req.session.currentUser ? req.session.currentUser : 'guest',
    });

    // Check if the cart is empty
    if (currentUserCart.length === 0) {
      return res.status(404).send('Cart is empty');
    }

    const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    // Create an order
    const order = {
      userId: req.session.currentUser || 'guest',
      items: currentUserCart,
      estimatedDeliveryTime,
    };

    // Insert the order into the orders database
    const newOrder = await orders.insert(order);
    res.status(201).json(newOrder);

    // Clear the cart for the current user
    await cart.remove({ userId: req.session.currentUser || 'guest' }, { multi: true });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Order confirmation page with estimated delivery time
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orders.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const items = order.items
      .map((item) => `<li>${item.title} (${item.price} kr)</li>`)
      .join('');
    const estimatedDeliveryTime = order.estimatedDeliveryTime;

    res.send(
      `<p>Order confirmation</p><ul>${items}</ul><p>Estimated delivery time: ${estimatedDeliveryTime}</p>`
    );
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export { orders };
export default router;
