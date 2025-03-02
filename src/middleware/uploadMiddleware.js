import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Multer
const videoStorage  = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "voty_videos",
   resource_type: "video",
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// Cloudinary Storage for Trivia Files (Excel)
const triviaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "voty_trivia_files",
    resource_type: "raw", // Allow non-media files like Excel
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// const upload = multer({ storage });
const upload = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit size (100MB)
});

// const uploadVideo = multer({
//   storage: videoStorage,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
// });

const uploadTrivia = multer({
  storage: triviaStorage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "application/vnd.ms-excel", // XLS
      "text/csv", // CSV
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only Excel (.xlsx, .xls) or CSV files are allowed."));
    }
  },
});

export { upload, uploadTrivia };
