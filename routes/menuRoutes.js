import express from 'express';
import { addProduct, updateProduct, deleteProduct } from '../models/productModel.js';
const router = express.Router();

// Add a new product to the menu
router.post("/", async (req, res) => {
  try{
    const newMenuItem = await addProduct(req.body)

    res.json({message: "New menu item added successfully", newMenuItem})

  }catch(error){
    res.status(500).json({message: "Error adding new menu item", error: error.message})
  }
})

// Update an existing product in the menu
router.put('/update', updateProduct);

// Remove a product from the menu

router.delete('/delete/:id', deleteProduct);

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;

//   removeProduct(id, (err, numRemoved) => {
//     if (err || numRemoved === 0) {
//       return res.status(404).send('Product not found');
//     }

//       res.status(200).json(products);
//     });
//   });


export default router;
