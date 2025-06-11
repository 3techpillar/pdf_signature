import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';

import dotenv from "dotenv";
import express from "express";
import connectDB from "./api/config/connectDB.js";
import uploadRoutes from "./api/routes/uploadRoutes.js";
dotenv.config(); 

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyParser.json());
const uploadDir = path.join("C:", "devenv", "work", "pdf_editor", "backend", "uploads");


app.use('/uploads', express.static(uploadDir));
app.use("/api/upload", uploadRoutes);

connectDB ();

// Start server
const PORT =  process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
