import { Router } from 'express';
import isAdmin from '../middlewares/authAdmin.js';
import db from '../database/db.js';
import { validateProduct } from '../middlewares/validation.js';

const router = Router();
// Middleware to format date
const formatDate = (date) => {
  const pad = (number) => number.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// POST Add new menu item
router.post('/', isAdmin, async (req, res) => {
  const product = req.body;

  if (!validateProduct(product)) {
    return res.status(400).json({ message: 'Invalid product properties' });
  }

  product.createdAt = formatDate(new Date());

  try {
    const newDoc = await db.menu.insert(product);
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// PUT Modify menu item
router.put('/:id', isAdmin, async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  if (!validateProduct(updatedProduct)) {
    return res.status(400).json({ message: 'Invalid product properties' });
  }

  updatedProduct.modifiedAt = formatDate(new Date());
  delete updatedProduct._id; // Remove _id from updatedProduct

  try {
    const numReplaced = await db.menu.update({ id: parseInt(productId, 10) }, { $set: updatedProduct });
    if (numReplaced === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ message: 'Product modified', numReplaced });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to modify product' });
  }
});

// DELETE menu item
router.delete('/:id', isAdmin, async (req, res) => {
  const productId = req.params.id;

  try {
    const numRemoved = await db.menu.remove({ id: parseInt(productId, 10) });
    if (numRemoved === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ message: 'Product deleted', numRemoved });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;
