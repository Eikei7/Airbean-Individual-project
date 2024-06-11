import db from './db.js';

export const addProduct = (product, callback) => {
  db.insert(product, callback);
};

export const getProductById = (id, callback) => {
  db.findOne({ id }, callback);
};

export const updateProduct = (id, updates, callback) => {
  db.update({ id }, { $set: updates }, {}, callback);
};

export const removeProduct = (id, callback) => {
  db.remove({ id }, {}, callback);
};

export const getAllProducts = (callback) => {
  db.find({}, callback);
};
