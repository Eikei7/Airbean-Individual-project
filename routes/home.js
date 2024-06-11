import express from 'express';

const router = express.Router();

// Example route
router.get("/start", (req, res) => {
    res.send("Welcome to Airbean!"); // Sending a plain text response
});

export default router;