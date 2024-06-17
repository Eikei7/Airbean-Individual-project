import { Router } from "express";
import { logInAdmin } from "../models/admin.js";

const router = Router()


//POST log in admin user
router.post("/", async (req, res) => {
    try{
      const admin = await logInAdmin(req.body.username, req.body.password)
  
      res.json({message: "Successfully logged in admin", admin})
  
    }catch(error){
      res.status(404).json({message: "Error logging in Admin", error: error.message})
    }
  })

  export default router;