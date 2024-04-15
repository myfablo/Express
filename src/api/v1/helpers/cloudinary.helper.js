const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dpox4drsw",
  api_key: "654613913124377",
  api_secret: "1OAEFB8DF2dWrHRxItcSBsiOnbk",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Provide local file path");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (!response) {
      console.log("There is a problem while uploading the file!");
      return null;
    }

    console.log(`File has been uploaded successfully on: ${response.url}`);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("File has been deleted");
    } else {
      console.error("Failed to delete local file");
    }

    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("File has been deleted");
    } else {
      console.error("Failed to delete local file");
    }

    console.log("Error in uploading image on Cloudinary", error);
    return null;
  }
};

module.exports = uploadOnCloudinary;
