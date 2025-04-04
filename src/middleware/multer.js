// // config/multer.js
// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
// }); 

// export const uploadProfilePic = multer({ 
//   storage, 
//   limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
// });

// export default upload;

// config/multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const createUpload = (fileSizeLimit) =>
  multer({
    storage,
    limits: { fileSize: fileSizeLimit },
  });

// export const upload = createUpload(100 * 1024 * 1024); // 100MB limit
// export const uploadProfilePic = createUpload(5 * 1024 * 1024); // 5MB limit

export const upload = createUpload(600 * 1024 * 1024); // 600MB limit
export const uploadProfilePic = createUpload(50 * 1024 * 1024); // 50MB limit
export const uploadAdminProfilePic = createUpload(50 * 1024 * 1024); // 50MB limit


// export default upload;
