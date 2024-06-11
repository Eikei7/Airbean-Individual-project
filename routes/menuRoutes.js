import express from 'express';
import { addProduct, getProductById, updateProduct, removeProduct, getAllProducts } from '../models/productModel.js';

const router = express.Router();

// Add a new product to the menu
router.post('/menu/add', (req, res) => {
  const { id, title, desc, price } = req.body;

  // Create the new product with the current date and time
  const newProduct = { id, title, desc, price, createdAt: new Date().toLocaleDateString() };

  addProduct(newProduct, (err, product) => {
    if (err) {
      return res.status(500).send('Failed to add product');
    }
    getAllProducts((err, products) => {
      if (err) {
        return res.status(500).send('Failed to retrieve products');
      }
      res.status(201).json(products);
    });
  });
});

// Update an existing product in the menu
router.post('/menu/update', (req, res) => {
  const { id, title, desc, price } = req.body;

  getProductById(id, (err, product) => {
    if (err || !product) {
      return res.status(404).send('Product not found');
    }

    const updates = { title, desc, price, modifiedAt: new Date().toLocaleDateString() };
    updateProduct(id, updates, (err, numAffected) => {
      if (err) {
        return res.status(500).send('Failed to update product');
      }
      res.status(200).json({ ...product, ...updates });
    });
  });
});

// Remove a product from the menu
router.delete('/menu/:id', (req, res) => {
  const { id } = req.params;

  removeProduct(id, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      return res.status(404).send('Product not found');
    }
    getAllProducts((err, products) => {
      if (err) {
        return res.status(500).send('Failed to retrieve products');
      }
      res.status(200).json(products);
    });
  });
});

export default router;
