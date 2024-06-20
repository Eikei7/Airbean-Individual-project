import express from 'express';
import nedb from 'nedb-promise';
import session from 'express-session';
import { validatePrice } from '../middlewares/validation.js';
import db from '../database/db.js';

const router = express.Router();
const cart = new nedb({ filename: './database/cart.db', autoload: true });

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

// Middleware to validate user price
const validatePriceMiddleware = async (req, res, next) => {
  try {
    const { id } = req.body;
    const selectedProduct = await db.menu.findOne({ id });

    if (!selectedProduct) {
      return res.status(404).send('The requested product could not be found');
    }

    if (typeof selectedProduct.price !== 'number' || selectedProduct.price <= 0) {
      return res.status(400).send('Invalid product price');
    }

    req.selectedProduct = selectedProduct; // Save the product to the request object for later use
    next();
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// User can order
router.post('/', validatePriceMiddleware, async (req, res) => {
  try {
    const { selectedProduct } = req;

    await cart.insert({
      userId: req.session.currentUser || 'guest',
      productId: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '/'), // Save order date
    });

    res.send(`${selectedProduct.title} (${selectedProduct.price} kr) was successfully added to cart`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Cart overview for the user
router.get('/', async (req, res) => {
  try {
    const cartItems = await cart.find({ userId: req.session.currentUser || 'guest' });

    if (cartItems.length === 0) {
      return res.send('No orders found');
    }

    const itemPrice = cartItems.map((item) => item.price);
    const sum = itemPrice.reduce((partialSum, a) => partialSum + a, 0);

    let cartSummary = 'Cart:\n';
    cartItems.forEach((cartItem) => {
      cartSummary += `<li>${cartItem.date}: ${cartItem.title}, ${cartItem.price} kr</li>`;
    });

    res.send(cartSummary + `<p>Total: ${sum} kr</p>`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete item from cart endpoint
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const numRemoved = await cart.remove({ productId: parseInt(itemId, 10) }, { multi: false });

    if (numRemoved === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// Clear user's cart based on the specified user ID
router.delete('/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const numRemoved = await cart.remove({ userId: userId }, { multi: true });

    res.json({ message: "User's cart cleared successfully", numRemoved });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

export { cart };
export default router;
