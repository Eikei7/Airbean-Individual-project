import db from '../database/db.js';

export const addProduct = (product, callback) => {
  db.insert(product, callback);
};

export const updateProduct = async (req, res, next) => {
  const { id, title, desc, price } = req.body
  const checkProduct = await db.findOne({id: id});
  if(!checkProduct) {
    return res.status(404).send("Hittade ingen produkt");
  }
  const test = await db.update(
    {id: id},
    {
      $set: {
        title: title,
        desc: desc,
        price: price,
        modifiedAt: new Date().toLocaleDateString(),
      },
    }
  );
  return res.send(`Product ${id} was changed`);
}
// export const updateProduct = (id, updates, callback) => {
//   db.update({ id }, { $set: updates }, {}, callback);
// };

export const removeProduct = (id, callback) => {
  db.remove({ id }, {}, callback);
};

export const deleteProduct = async (req, res, next) => {
  const { productID } = req.body;
  db.remove({ id: productID });
  res.status(200).send(`Product ${productID} deleted`);
};

export const getAllProducts = (callback) => {
  db.find({}, callback);
};
