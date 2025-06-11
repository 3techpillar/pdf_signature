import express from "express";
import fs from 'fs';
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';


const router = express.Router();
const uploadDir = path.join("C:", "devenv", "work", "pdf_editor", "backend", "uploads");

// Check if the directory exists before trying to create it
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Upload directory created successfully:", uploadDir);
  } catch (err) {
    console.error("Failed to create upload directory:", err);
  }
}

// Get __dirname correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Prevent filename conflicts
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // MIME type for .docx
      ];
      
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

router.post("/", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      // Compose accessible URL for the uploaded file
      const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  
      return res.status(200).json({
        message: "File uploaded successfully",
        file: {
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          filename: req.file.filename,
          url: fileUrl
        }
      });
  
    } catch (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  


export default router;
