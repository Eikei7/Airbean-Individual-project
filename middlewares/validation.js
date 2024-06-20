import db from "../database/db.js";

// Middleware to validate user creation
export const validateUserCreation = (req, res, next) => {
  const { username } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid username" });
  }

  next();
};

// Middleware to validate product price
export const validatePrice = async (req, res, next) => {
  const { id } = req.body;

  try {
    const selectedProduct = await db.menu.findOne({ id });

    if (!selectedProduct) {
      return res.status(404).send("The requested product could not be found");
    }

    if (typeof selectedProduct.price !== "number" || selectedProduct.price <= 0) {
      return res.status(400).send("Invalid product price");
    }

    next();
  } catch (error) {
    res.status(500).send("Database error");
  }
};

// Function to validate product structure
export const validateProduct = (product) => {
  const requiredFields = ['id', 'title', 'desc', 'price'];
  const keys = Object.keys(product);
  return requiredFields.every(field => keys.includes(field));
};
