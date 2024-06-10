import express from 'express';
import menu from '../models/coffeeMenu.js';
import { validateProduct } from '../middlewares/validation.js';

const router = express.Router();

// Add a new product to the menu
router.post('/menu', validateProduct, (req, res) => {
  const { id, title, desc, price } = req.body;

  // Check if the id is unique
  const existingProduct = menu.find(product => product.id === id);
  if (existingProduct) {
    return res.status(400).send('Product with this ID already exists');
  }

  // Create the new product with the current date and time
  const newProduct = { id, title, desc, price, createdAt: new Date().toLocaleDateString() };

  // Add the new product to the menu
  menu.push(newProduct);

  // Send a response with the updated menu
  res.status(201).json(menu);
});

// Update an existing product in the menu
router.post('/menu/update', validateProduct, (req, res) => {
  const { id, title, desc, price } = req.body;

  // Find the product by id
  const productIndex = menu.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  // Update the product details
  menu[productIndex] = { ...menu[productIndex], title, desc, price, modifiedAt: new Date().toLocaleDateString() };

  // Send a response with the updated product
  res.status(200).json(menu[productIndex]);
});

// Remove a product from the menu
router.delete('/menu/:id', (req, res) => {
  const { id } = req.params;

  // Find the index of the product by id
  const productIndex = menu.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  // Remove the product from the array
  menu.splice(productIndex, 1);

  // Send a response with the updated menu
  res.status(200).json(menu);
});

export default router;
