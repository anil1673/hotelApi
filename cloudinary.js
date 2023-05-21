// import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'your_cloud_name',
//   api_key: 'your_api_key',
//   api_secret: 'your_api_secret'
// });

// // Function to upload a single image to Cloudinary
// export const uploadImage = (path) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(path, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };

// // Function to upload multiple images to Cloudinary
// export const uploadMultipleImages = async (paths) => {
//   try {
//     const uploadPromises = paths.map((path) => uploadImage(path));
//     const results = await Promise.all(uploadPromises);
//     console.log('Upload successful:', results);
//   } catch (error) {
//     console.error('Upload failed:', error);
//   }
// };

// // // Example usage
// // const imagePaths = ['./image1.jpg', './image2.jpg', './image3.jpg'];
// // uploadMultipleImages(imagePaths);














// // import { v2 as cloudinary } from 'cloudinary';



// // // Configuration 
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDIANRY_NAME,
// //   api_key:process.env.CLOUDIANRY_API_KEY,
// //   api_secret:process.env.CLOUDIANRY_SECRET_KEY
// // });

// // export default cloudinary;


