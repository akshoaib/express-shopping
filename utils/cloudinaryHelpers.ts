import cloudinaryConfig from "../config/cloudinary";
const uploadToCloudinary = async (file: any) => {
  try {
    const result = await cloudinaryConfig.uploader.upload(file, {
      folder: "products",
    });

    return result.secure_url;
  } catch (error) {
    console.log(error);
  }
};

module.exports = uploadToCloudinary;
