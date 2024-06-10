import express from 'express';
import nedb from 'nedb-promise';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAllProducts, getProductById } from '../models/productModel.js';
import { validateMenu, validatePrice } from '../middlewares/validation.js';
import { cart } from './cart.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const orders = new nedb({ filename: 'models/orders.db', autoload: true });

// Middleware to handle user sessions
router.use(
  session({
    secret: '12345',
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

// Get all products from the menu
router.get('/', validateMenu, async (req, res) => {
  try {
    const products = await getAllProducts();
    const coffeeMenu = products.map((item) => ({
      title: item.title,
      price: item.price,
      id: item.id,
    }));
    res.status(200).json(coffeeMenu);
  } catch (err) {
    console.error('Failed to retrieve products:', err);
    res.status(500).send('Failed to retrieve products');
  }
});

// Place an order and store in order history
router.post('/', validatePrice, async (req, res) => {
  try {
    const orderId = req.body.id;
    const selectedProduct = await getProductById(orderId); // Await the result of getProductById()

    if (!selectedProduct) {
      return res.status(404).send('The requested product could not be found');
    }

    // Insert the product into the cart
    await cart.insert({
      userId: req.session.currentUser || 'guest', // Store user ID
      productId: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      date: new Date().toLocaleDateString(), // Store order date
    });

    // Respond with a success message
    res.status(200).send('Product added to cart successfully');
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send('Internal server error');
  }
});

// Confirmation page for an order
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
