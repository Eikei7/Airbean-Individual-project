import menu from "../models/coffeeMenu.js";

const validateUserCreation = (req, res, next) => {

  const { username } = req.body;

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ error: "Invalid username" });
  }
  next();

};
// Validate the menu data
export const validateMenu = (req, res, next) => {
  const isValid = menu.every((item) => {
    return typeof item.title === "string" && typeof item.price === "number";
  });

  if (!isValid) {
    return res.status(400).json({
      error:
        "Invalid menu data. Each item must have a title (string) and a price (number).",
    });
  }
  next();
};
// Validate the price of a product
const validatePrice = (req, res, next) => {
  const { id } = req.body;
  const selectedProduct = menu.find((product) => product.id === id);

  if (!selectedProduct) {
    return res.status(404).send("The requested product could not be found");
  }

  if (typeof selectedProduct.price !== "number" || selectedProduct.price <= 0) {
    return res.status(400).send("Invalid product price");
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const allowedKeys = ['id', 'title', 'desc', 'price'];
  const productKeys = Object.keys(req.body);

  // Check for unexpected keys
  const unexpectedKeys = productKeys.filter(key => !allowedKeys.includes(key));
  if (unexpectedKeys.length > 0) {
    return res.status(400).send(`Unexpected properties: ${unexpectedKeys.join(', ')}`);
  }

  // Validate required keys and types
  const { id, title, desc, price } = req.body;
  if (!id || !title || !desc || typeof price !== 'number') {
    return res.status(400).send('Invalid input data');
  }

  next(); // Proceed to the next middleware or route handler
};

export { validateUserCreation, validatePrice };
