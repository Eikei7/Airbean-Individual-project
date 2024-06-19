import { Router } from 'express';
import isAdmin from '../middlewares/authAdmin.js';
import db from '../database/db.js';
import { validateProduct } from '../middlewares/validation.js';

const router = Router();

// POST Add new menu item
router.post('/', isAdmin, (req, res) => {
  const product = req.body;

  if (!validateProduct(product)) {
    return res.status(400).json({ message: 'Invalid product properties' });
  }

  product.createdAt = new Date();

  db.menu.insert(product)
    .then(newDoc => res.status(201).json(newDoc))
    .catch(err => res.status(500).json({ message: 'Failed to add product' }));
});

// PUT Modify menu item
router.put('/:id', isAdmin, (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  if (!validateProduct(updatedProduct)) {
    return res.status(400).json({ message: 'Invalid product properties' });
  }

  updatedProduct.modifiedAt = new Date();

  db.menu.update({ id: productId }, { $set: updatedProduct })
    .then(numReplaced => {
      if (numReplaced === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json({ message: 'Product modified', numReplaced });
      }
    })
    .catch(err => res.status(500).json({ message: 'Failed to modify product' }));
});

// DELETE menu item
router.delete('/:id', isAdmin, (req, res) => {
  const productId = req.params.id;

  db.menu.remove({ id: productId })
    .then(numRemoved => {
      if (numRemoved === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json({ message: 'Product deleted', numRemoved });
      }
    })
    .catch(err => res.status(500).json({ message: 'Failed to delete product' }));
});

export default router;
