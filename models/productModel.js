import db from './db.js';

export const addProduct = (product, callback) => {
  db.insert(product, callback);
};

export const getProductById = (id, callback) => {
  db.findOne({ id: parseInt(id) }, callback);
};

export const updateProduct = (id, updates, callback) => {
  db.update({ id }, { $set: updates }, {}, callback);
};

export const removeProduct = (id, callback) => {
  db.remove({ id: parseInt(id) }, {}, callback);
};

export const getAllProducts = (callback) => {
  db.find({}, callback);
};

// Proper way to use getAllProducts
getAllProducts((err, products) => {
  if (err) {
    console.error("Error fetching products:", err);
  } else {
    console.log(products);
  }
});
