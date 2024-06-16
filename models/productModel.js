import db from '../database/db.js';

// Function for menu
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await db.menu.find({});
    res.send(allProducts);
  } catch (error) {
    res.status(500).send({ error: 'Could not get find the menu... no coffee for you!' });
  }
};


//Add new menu item in menu
export const addProduct = async (Item) => {
  try{

    //Check if the req body has valid keys
    if(Item.hasOwnProperty('title') && Item.hasOwnProperty('desc') && Item.hasOwnProperty('price')){

    //Adding time and date to new menu object
      const newDateObject = new Date()
      Item.createdAt = newDateObject.toLocaleString()
  
    //Adding new item to menu
      const newMenuItem = db.menu.insert(Item)

    }else{
      throw new Error("Not a valid menu item. Must have title, desc and price keys")
    }

  }catch(error){
    console.error("Error adding new menu item to cart", error)
    throw error
  }
}

//Update menu item in menu
export const updateProduct = async (id, updatedProduct) => {
    try{
      //Check if the item with specific id exist.
      const menuItem = await db.menu.findOne({_id: id})

      if(!menuItem){
        throw new Error("Menu item not found, id does not match/exist")
      }
      //Add modified time and deta to updated item
      const newDateObject = new Date()
      updatedMenuItem.modifiedAt = newDateObject.toLocaleString()

      //Update the item
      const updatingMenu = await db.menu.update({_id : menuItem._id}, {$set : updatedMenuItem})

      console.log("Update menu", updatingMenu)

    }catch(error){
      console.error("Error updating menu item", error)
      throw error
    }
}

//Delete menu item in menu
export const deleteProduct = async (id) => {

  try{
    console.log("Checking id", id)

    const productToDelete = await db.menu.findOne({_id: id})
    console.log("Full product to delete", productToDelete)

    if(!productToDelete){
      throw new Error("Product does not exist")
    }

    const deleteProduct = await db.menu.remove({_id: id})
    console.log("Product deleted", deleteProduct)
  }catch(error){
    console.error("Error deleting product", error)
    throw error
  }

}