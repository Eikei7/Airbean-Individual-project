import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import router from "./routes/airbean.js";

const app = express();
const PORT = 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(express.json());
app.use("/", router);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
