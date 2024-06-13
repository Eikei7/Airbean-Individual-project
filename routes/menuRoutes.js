import express from 'express';
import { addProduct, updateProduct, deleteProduct, removeProduct } from '../models/productModel.js';
const router = express.Router();

// Add a new product to the menu
router.post('/add', (req, res) => {
  const { id, title, desc, price } = req.body;

  // Create the new product with the current date and time
  const newProduct = { id, title, desc, price, createdAt: new Date().toLocaleDateString() };

  console.log('Adding new product:', newProduct);

  addProduct(newProduct, (err, product) => {
    if (err) {
      console.error('Failed to add product:', err);
      return res.status(500).send('Failed to add product');
    }

    console.log('Product added successfully:', product);

    res.status(201).json(product);
  });
});

// Update an existing product in the menu
router.put('/update', updateProduct);

// Remove a product from the menu

router.delete('/delete/:id', deleteProduct);

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  removeProduct(id, (err, numRemoved) => {
    if (err || numRemoved === 0) {
      return res.status(404).send('Product not found');
    }

      res.status(200).json(products);
    });
  });


export default router;
