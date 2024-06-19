import db from "../database/db.js";

export const validateUserCreation = (req, res, next) => {

  const { username } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {

    return res.status(400).json({ error: "Invalid username" });

  }

};

export const validatePrice = (req, res, next) => {
  const { id } = req.body;
  const selectedProduct = db.menu.find((product) => product.id === id);

  if (!selectedProduct) {
    return res.status(404).send("The requested product could not be found");
  }

  if (typeof selectedProduct.price !== "number" || selectedProduct.price <= 0) {
    return res.status(400).send("Invalid product price");
  }

};

export const validateProduct = (product) => {
  const requiredFields = ['id', 'title', 'desc', 'price'];
  const keys = Object.keys(product);
  return requiredFields.every(field => keys.includes(field));
};
