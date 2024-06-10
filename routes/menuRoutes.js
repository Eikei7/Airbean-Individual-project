import express from 'express';
import { validateProduct } from '../middlewares/validation.js';
import { addProduct, getProductById, updateProduct, removeProduct, getAllProducts } from '../models/productModel.js';

const router = express.Router();

// Helper function to remove _id field
const removeIdField = (products) => {
  return products.map(product => {
    const { _id, ...rest } = product;
    return rest;
  });
};

// Add a new product to the menu
router.post('/menu', validateProduct, (req, res) => {
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
      res.status(201).json(removeIdField(products));
    });
  });
});

// Update an existing product in the menu
router.post('/menu/update', validateProduct, (req, res) => {
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
      res.status(200).json({ ...product, ...updates, _id: undefined });
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
      res.status(200).json(removeIdField(products));
    });
  });
});

export default router;
