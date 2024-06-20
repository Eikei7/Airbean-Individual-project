import db from '../database/db.js';

const AddCampaignItem = async (Item1, Item2, price) => {
    try{
        console.log("CAMPAIGN ITEMS", Item1, Item2, price)
        const campaignItem1 = await db.menu.findOne({_id: Item1})
        const campaignItem2 = await db.menu.findOne({_id: Item2})
        console.log("Items in menu", [campaignItem1, campaignItem2])

        if(!campaignItem1 || !campaignItem2){
            throw new Error("One of the menu items does not exist")
        }

        const addItemToCampaignDB = await db.campaigns.insert({products: [campaignItem1, campaignItem2], price: price})

        console.log("Add item object", addItemToCampaignDB)

    }catch(error){
        console.error("Error adding campaign item", error)
        throw error
    }
}

export default AddCampaignItem