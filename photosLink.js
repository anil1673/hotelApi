import { v2 as cloudinary } from 'cloudinary';
import multer from "multer"
import {CloudinaryStorage} from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDIANRY_NAME,
    api_key:process.env.CLOUDIANRY_API_KEY,
    api_secret:process.env.CLOUDIANRY_SECRET_KEY
  });
  
  // Configure Cloudinary storage for multer
  export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'hotel-images',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });
  
  // Create multer instance with the configured storage
  export const upload = multer({ storage: storage });

  export default cloudinary;