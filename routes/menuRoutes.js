import express from 'express';
import menu from '../models/coffeeMenu.js'; // Adjust the path based on your project structure

const router = express.Router();

// Add a new product to the menu
router.post('/menu', (req, res) => {
  const { id, title, desc, price } = req.body;

  // Input validation
  if (!id || !title || !desc || typeof price !== 'number') {
    return res.status(400).send('Invalid input data');
  }

  // Check if the id is unique
  const existingProduct = menu.find(product => product.id === id);
  if (existingProduct) {
    return res.status(400).send('Product with this ID already exists');
  }

  // Create the new product with the current date and time
  const newProduct = { id, title, desc, price, createdAt: new Date().toISOString() };

  // Add the new product to the menu
  menu.push(newProduct);

  // Send a response with the updated menu
  res.status(201).json(menu);
});

export default router;

