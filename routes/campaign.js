import {Router} from "express"
import AddCampaignItem from "../models/campaign.js"

const router = Router()

// POST new campaign

router.post("/", async (req, res) =>{
    try{
        const newCampaignItem = await AddCampaignItem(req.body.products[0], req.body.products[1], req.body.price)
        res.json({message: "New campaign item added successfully", newCampaignItem})
    }catch(error){
        res.status(404).json({message: "Error adding new campaign item", error: error.message})
    }
})

export default router