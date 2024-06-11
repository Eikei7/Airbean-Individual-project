import express from 'express'

const router = express.Router()

router.get("/", (req, res) => {
  res.send("Welcome to Airbean!")
});

  export default router;